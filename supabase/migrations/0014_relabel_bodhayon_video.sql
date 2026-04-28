-- 0014_relabel_bodhayon_video.sql
-- Stakeholder feedback: the YouTube video at id BMFBOWVmAUc is BACDA's
-- own original musical production "Bodhayon", not an NABC ceremony.
-- Earlier seeds and any admin entries that labeled it "NABC ceremonial"
-- with description "Opening dance for the North American Bengali
-- Conference." get corrected here.

update gallery_videos
set
  title = 'Bodhayon',
  description = 'A BACDA original musical production — filmed during Durga Puja 2020.'
where youtube_id = 'BMFBOWVmAUc';
