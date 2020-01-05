# end goal

Player can control a dude to run around a single screen of blocks.
The dude can move left, right and jump. The dude can shoot a grappling
hook up at a fixed angle, which grabs onto blocks. Grappling behaviour
is similar to Speed Runners - grapple wire doesn't get caught on anything,
doesn't change length once attached.

# feature to implement, in order
- grapple attaches to blocks
    - check swinging behaviour here. need physics? does it just work?
- debug rendering: draw object physical shapes
- re-shoot grapple at any time. re-shooting cancels previous grapple
- tests
- don't use matter for platform running?
- move camera: level extends to right/left, can move there and camera follows
