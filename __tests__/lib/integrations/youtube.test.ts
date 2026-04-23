/**
 * Unit tests for lib/integrations/youtube.ts
 * Covers every URL shape that YouTube exposes + invalid inputs.
 */

import { describe, it, expect } from 'vitest';
import {
  parseYouTubeId,
  isValidYouTubeInput,
  getVideoThumbnail,
  getEmbedUrl,
  getWatchUrl,
} from '@/lib/integrations/youtube';

// A valid 11-char ID from the legacy site: `KWzwSzxBUis`.
const VALID_ID = 'KWzwSzxBUis';
const ANOTHER_VALID_ID = 'aX0ykUf-g0k'; // includes `-`
const UNDERSCORE_ID = 'ab_cd-EFGHI'; // includes `_` and `-`

describe('parseYouTubeId — bare IDs', () => {
  it('accepts a bare 11-char ID as-is', () => {
    expect(parseYouTubeId(VALID_ID)).toBe(VALID_ID);
  });

  it('accepts an ID with underscores and hyphens', () => {
    expect(parseYouTubeId(UNDERSCORE_ID)).toBe(UNDERSCORE_ID);
  });

  it('trims surrounding whitespace on a bare ID', () => {
    expect(parseYouTubeId(`  ${VALID_ID}  `)).toBe(VALID_ID);
  });

  it('rejects strings shorter than 11 chars', () => {
    expect(parseYouTubeId('abc')).toBeNull();
  });

  it('rejects strings longer than 11 chars that are not URLs', () => {
    expect(parseYouTubeId('abcdefghijklm')).toBeNull();
  });

  it('rejects IDs with invalid characters', () => {
    expect(parseYouTubeId('abcdefg!!!@#')).toBeNull();
  });
});

describe('parseYouTubeId — youtu.be short links', () => {
  it('parses a standard youtu.be link', () => {
    expect(parseYouTubeId(`https://youtu.be/${VALID_ID}`)).toBe(VALID_ID);
  });

  it('parses a youtu.be link with a timestamp query param', () => {
    expect(parseYouTubeId(`https://youtu.be/${VALID_ID}?t=42`)).toBe(VALID_ID);
  });

  it('parses a www.youtu.be link', () => {
    expect(parseYouTubeId(`https://www.youtu.be/${VALID_ID}`)).toBe(VALID_ID);
  });

  it('parses an http (non-https) youtu.be link', () => {
    expect(parseYouTubeId(`http://youtu.be/${VALID_ID}`)).toBe(VALID_ID);
  });
});

describe('parseYouTubeId — youtube.com/watch?v= links', () => {
  it('parses the canonical watch URL', () => {
    expect(parseYouTubeId(`https://www.youtube.com/watch?v=${VALID_ID}`)).toBe(
      VALID_ID,
    );
  });

  it('parses watch URL with playlist and index params', () => {
    expect(
      parseYouTubeId(
        `https://www.youtube.com/watch?v=${VALID_ID}&list=PL123&index=2`,
      ),
    ).toBe(VALID_ID);
  });

  it('parses a mobile m.youtube.com watch URL', () => {
    expect(parseYouTubeId(`https://m.youtube.com/watch?v=${VALID_ID}`)).toBe(
      VALID_ID,
    );
  });

  it('parses a URL with no scheme', () => {
    expect(parseYouTubeId(`youtube.com/watch?v=${VALID_ID}`)).toBe(VALID_ID);
  });

  it('parses a URL where v is the second query param', () => {
    expect(
      parseYouTubeId(`https://www.youtube.com/watch?feature=share&v=${VALID_ID}`),
    ).toBe(VALID_ID);
  });
});

describe('parseYouTubeId — /embed/ links', () => {
  it('parses a standard embed URL', () => {
    expect(parseYouTubeId(`https://www.youtube.com/embed/${VALID_ID}`)).toBe(
      VALID_ID,
    );
  });

  it('parses an embed URL with query params', () => {
    expect(
      parseYouTubeId(
        `https://www.youtube.com/embed/${VALID_ID}?autoplay=1&mute=1`,
      ),
    ).toBe(VALID_ID);
  });

  it('parses a youtube-nocookie.com embed URL', () => {
    expect(
      parseYouTubeId(`https://www.youtube-nocookie.com/embed/${VALID_ID}`),
    ).toBe(VALID_ID);
  });
});

describe('parseYouTubeId — /shorts/ links', () => {
  it('parses a shorts URL', () => {
    expect(parseYouTubeId(`https://www.youtube.com/shorts/${VALID_ID}`)).toBe(
      VALID_ID,
    );
  });

  it('parses a shorts URL on m.youtube.com', () => {
    expect(parseYouTubeId(`https://m.youtube.com/shorts/${VALID_ID}`)).toBe(
      VALID_ID,
    );
  });
});

describe('parseYouTubeId — /v/ and /live/ paths', () => {
  it('parses a legacy /v/ URL', () => {
    expect(parseYouTubeId(`https://www.youtube.com/v/${VALID_ID}`)).toBe(
      VALID_ID,
    );
  });

  it('parses a /live/ URL', () => {
    expect(parseYouTubeId(`https://www.youtube.com/live/${VALID_ID}`)).toBe(
      VALID_ID,
    );
  });
});

describe('parseYouTubeId — IDs with allowed hyphen/underscore characters', () => {
  it('parses IDs containing hyphens', () => {
    expect(
      parseYouTubeId(`https://www.youtube.com/watch?v=${ANOTHER_VALID_ID}`),
    ).toBe(ANOTHER_VALID_ID);
  });
});

describe('parseYouTubeId — invalid inputs', () => {
  it('returns null for an empty string', () => {
    expect(parseYouTubeId('')).toBeNull();
  });

  it('returns null for whitespace-only input', () => {
    expect(parseYouTubeId('   ')).toBeNull();
  });

  it('returns null for non-YouTube hostnames', () => {
    expect(parseYouTubeId(`https://vimeo.com/${VALID_ID}`)).toBeNull();
    expect(
      parseYouTubeId(`https://example.com/watch?v=${VALID_ID}`),
    ).toBeNull();
  });

  it('returns null for a YouTube URL with no ID anywhere', () => {
    expect(parseYouTubeId('https://www.youtube.com/')).toBeNull();
    expect(parseYouTubeId('https://www.youtube.com/feed/trending')).toBeNull();
  });

  it('returns null for a watch URL whose v param is malformed', () => {
    expect(parseYouTubeId('https://www.youtube.com/watch?v=tooShort')).toBeNull();
  });

  it('returns null for garbage strings', () => {
    expect(parseYouTubeId('not a url')).toBeNull();
    expect(parseYouTubeId('http://')).toBeNull();
  });

  it('returns null for non-string inputs', () => {
    // Intentional any cast to exercise runtime guard.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseYouTubeId(null as any)).toBeNull();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseYouTubeId(undefined as any)).toBeNull();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseYouTubeId(123 as any)).toBeNull();
  });
});

describe('isValidYouTubeInput', () => {
  it('returns true for any parseable input', () => {
    expect(isValidYouTubeInput(VALID_ID)).toBe(true);
    expect(isValidYouTubeInput(`https://youtu.be/${VALID_ID}`)).toBe(true);
    expect(
      isValidYouTubeInput(`https://www.youtube.com/watch?v=${VALID_ID}`),
    ).toBe(true);
  });

  it('returns false for invalid input', () => {
    expect(isValidYouTubeInput('')).toBe(false);
    expect(isValidYouTubeInput('not valid')).toBe(false);
    expect(isValidYouTubeInput('https://vimeo.com/12345')).toBe(false);
  });
});

describe('getVideoThumbnail', () => {
  it('returns maxresdefault URL by default', () => {
    expect(getVideoThumbnail(VALID_ID)).toBe(
      `https://i.ytimg.com/vi/${VALID_ID}/maxresdefault.jpg`,
    );
  });

  it('returns hqdefault URL when quality=hq', () => {
    expect(getVideoThumbnail(VALID_ID, 'hq')).toBe(
      `https://i.ytimg.com/vi/${VALID_ID}/hqdefault.jpg`,
    );
  });

  it('returns default URL when quality=default', () => {
    expect(getVideoThumbnail(VALID_ID, 'default')).toBe(
      `https://i.ytimg.com/vi/${VALID_ID}/default.jpg`,
    );
  });
});

describe('getEmbedUrl', () => {
  it('returns the canonical embed URL', () => {
    expect(getEmbedUrl(VALID_ID)).toBe(
      `https://www.youtube.com/embed/${VALID_ID}`,
    );
  });
});

describe('getWatchUrl', () => {
  it('returns the canonical watch URL', () => {
    expect(getWatchUrl(VALID_ID)).toBe(
      `https://www.youtube.com/watch?v=${VALID_ID}`,
    );
  });
});
