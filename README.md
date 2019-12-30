# end goal

Player can control a dude to run around a single screen of blocks.
The dude can move left, right and jump. The dude can shoot a grappling
hook up at a fixed angle, which grabs onto blocks. Grappling behaviour
is similar to Speed Runners - grapple wire doesn't get caught on anything,
doesn't change length once attached.

# feature list, in order
- show dude *done*
- show dude on ground block *done*
- separate renderers from objects *done*
- move dude left and right on block *done*
- game display is responsive to window size *done, sort of*
- dude falls *done*
- dude collides with ground *done*
- sync render/matter coords (matter position = center of mass, pixi position = top left) *done*
- remove matter dependency from game objects *done*
- move dude left and right on block (fix) *done*
- dude can jump
- dude cannot go off screen
- dude can shoot grapple
    - grapple doesn't attach
    - grapple cancels after fixed length
- re-shoot grapple at any time. re-shooting cancels previous grapple
- grapple attaches to blocks
    - check swinging behaviour here. need physics? does it just work?
- draw my own dude sprite
- move camera: level extends to right/left, can move there and camera follows
