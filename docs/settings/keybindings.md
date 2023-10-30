# Keybindings

Keybindings allow you to specify key combinations to perform an action. They are set as strings and should be structured as follows:

```
<MODIFIER_1>+<MODIFIER_2>+<KEY/KEYCODE>
```

You do not need to specify a specific number of modifiers. Here are the following modifier names & uses:

| Settings Name | Windows     | Linux       | MacOS   |
| ------------- | ----------- | ----------- | ------- |
| `shift`       | Shift       | Shift       | Shift   |
| `control`     | Ctrl        | Ctrl        | Control |
| `alt`         | Alt         | Alt         | Option  |
| `meta`        | Unavailable | Meta        | Command |
| `accel`       | Ctrl        | Ctrl or Alt | Command |

For the most part, you can just enter the letter on the key for your keybind. For situations when this is unavailable, you can use one of the following keycodes:

|                 |                |                  |                |
| --------------- | -------------- | ---------------- | -------------- |
| VK_CANCEL       | VK_BACK        | VK_TAB           | VK_CLEAR       |
| VK_RETURN       | VK_ENTER       | VK_SHIFT         | VK_CONTROL     |
| VK_ALT          | VK_PAUSE       | VK_CAPS_LOCK     | VK_ESCAPE      |
| VK_SPACE        | VK_PAGE_UP     | VK_PAGE_DOWN     | VK_END         |
| VK_HOME         | VK_LEFT        | VK_UP            | VK_RIGHT       |
| VK_DOWN         | VK_PRINTSCREEN | VK_INSERT        | VK_DELETE      |
| VK_0            | VK_1           | VK_2             | VK_3           |
| VK_4            | VK_5           | VK_6             | VK_7           |
| VK_8            | VK_9           | VK_SEMICOLON     | VK_EQUALS      |
| VK_A            | VK_B           | VK_C             | VK_D           |
| VK_E            | VK_F           | VK_G             | VK_H           |
| VK_I            | VK_J           | VK_K             | VK_L           |
| VK_M            | VK_N           | VK_O             | VK_P           |
| VK_Q            | VK_R           | VK_S             | VK_T           |
| VK_U            | VK_V           | VK_W             | VK_X           |
| VK_Y            | VK_Z           | VK_NUMPAD0       | VK_NUMPAD1     |
| VK_NUMPAD2      | VK_NUMPAD3     | VK_NUMPAD4       | VK_NUMPAD5     |
| VK_NUMPAD6      | VK_NUMPAD7     | VK_NUMPAD8       | VK_NUMPAD9     |
| VK_MULTIPLY     | VK_ADD         | VK_SEPARATOR     | VK_SUBTRACT    |
| VK_DECIMAL      | VK_DIVIDE      | VK_F1            | VK_F2          |
| VK_F3           | VK_F4          | VK_F5            | VK_F6          |
| VK_F7           | VK_F8          | VK_F9            | VK_F10         |
| VK_F11          | VK_F12         | VK_F13           | VK_F14         |
| VK_F15          | VK_F16         | VK_F17           | VK_F18         |
| VK_F19          | VK_F20         | VK_F21           | VK_F22         |
| VK_F23          | VK_F24         | VK_NUM_LOCK      | VK_SCROLL_LOCK |
| VK_COMMA        | VK_PERIOD      | VK_SLASH         | VK_BACK_QUOTE  |
| VK_OPEN_BRACKET | VK_BACK_SLASH  | VK_CLOSE_BRACKET | VK_QUOTE       |
| VK_HELP         |

Developers should follow [Mozilla's guidelines](https://website-archive.mozilla.org/www.mozilla.org/access/access/keyboard/) when adding default keybinds. For more information about implementation details, see [udn](https://udn.realityripple.com/docs/Archive/Mozilla/XUL/Tutorial/Keyboard_Shortcuts).
