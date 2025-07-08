# Status Widget - GNOME Extension

A minimal GNOME Shell extension that displays configurable status indicators for background AI tools and processes. Designed to reduce context switching frustration when waiting for AI tools like Cursor, Claude, or Copilot to complete tasks.

## Features

- **Zero or more indicators**: Add/remove status indicators dynamically
- **Simple emoji icons**: Static, non-distracting indicators (default: ✅ ready, ⚠️ working, ⛔ waiting)
- **Customizable**: Configure indicator names, icons, and positioning
- **D-Bus control**: Programmatic control via D-Bus for external applications
- **Lightweight**: Minimal resource usage and clean UI integration
- **Configurable positioning**: Place indicators in left, center, or right panel areas

## Installation

### Quick Start

To quickly see the extension in action:

1. Run the installation script:
   ```bash
   ./install.sh
   ```
2. Restart GNOME Shell (Alt+F2, type 'r', press Enter) or log out/in
3. Enable the extension:
   ```bash
   gnome-extensions enable status-widget@nmalik.github.io
   ```
4. Run the demo client:
   ```bash
   ./example-client.py
   ```

### Prerequisites

- GNOME Shell 45 or later
- `glib-compile-schemas` (usually included with GNOME)

### Manual Install

1. Copy the extension files to your extensions directory:
   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/status-widget@nmalik.github.io
   cp -r * ~/.local/share/gnome-shell/extensions/status-widget@nmalik.github.io/
   ```
2. Compile the GSettings schema:
   ```bash
   glib-compile-schemas ~/.local/share/gnome-shell/extensions/status-widget@nmalik.github.io/schemas/
   ```

## Usage

### Configuration

Open the extension preferences to configure indicators:

```bash
gnome-extensions prefs status-widget@nmalik.github.io
```

Or through the Extensions app in GNOME Settings.

#### Adding Indicators

1. Click "Add Indicator" in the preferences
2. Enter a name (e.g., "Cursor AI")
3. Set ready icon (default: ✅)
4. Set working icon (default: ⚠️)
5. Click "Add"

#### Settings

- **Position**: Choose left, center, or right panel placement
- **Show Labels**: Toggle text labels next to icons
- **Indicators**: Add, edit, or remove individual indicators

### Programmatic Control

Control indicators via D-Bus for integration with external tools:

#### Python Example

```python
import dbus

# Connect to the extension
bus = dbus.SessionBus()
proxy = bus.get_object('org.gnome.Shell', '/org/gnome/shell/extensions/StatusWidget')
interface = dbus.Interface(proxy, 'org.gnome.shell.extensions.StatusWidget')

# Add an indicator
interface.AddIndicator("cursor", "Cursor AI", "✅", "🔄", "⛔")

# Set status to working
interface.SetIndicatorStatus("cursor", "working")

# Set status to waiting for input
interface.SetIndicatorStatus("cursor", "waiting")

# Set status to ready
interface.SetIndicatorStatus("cursor", "ready")

# Remove indicator
interface.RemoveIndicator("cursor")
```

#### Shell Commands

```bash
# Add indicator
gdbus call --session --dest org.gnome.Shell \
  --object-path /org/gnome/shell/extensions/StatusWidget \
  --method org.gnome.shell.extensions.StatusWidget.AddIndicator \
  "cursor" "Cursor AI" "✅" "🔄" "⛔"

# Set working status
gdbus call --session --dest org.gnome.Shell \
  --object-path /org/gnome/shell/extensions/StatusWidget \
  --method org.gnome.shell.extensions.StatusWidget.SetIndicatorStatus \
  "cursor" "working"

# Set waiting status
gdbus call --session --dest org.gnome.Shell \
  --object-path /org/gnome/shell/extensions/StatusWidget \
  --method org.gnome.shell.extensions.StatusWidget.SetIndicatorStatus \
  "cursor" "waiting"

# Set ready status
gdbus call --session --dest org.gnome.Shell \
  --object-path /org/gnome/shell/extensions/StatusWidget \
  --method org.gnome.shell.extensions.StatusWidget.SetIndicatorStatus \
  "cursor" "ready"
```

### Demo Script

Run the included example script to see the extension in action:

```bash
# Install python-dbus if needed
pip install dbus-python

# Run demo
./example-client.py
```

## Security

The extension implements comprehensive security measures to protect against malicious or misbehaving applications:

### Security Features

✅ **Input Validation**
- All text inputs are sanitized and length-limited
- HTML/XML characters and control characters are stripped
- Only valid status values ("ready", "working", "waiting") are accepted

✅ **Rate Limiting**
- Configurable minimum time between D-Bus calls per application (default: 100ms)
- Prevents spam attacks and excessive resource usage

✅ **Application Limits**
- Maximum number of indicators per application (default: 5)
- Prevents indicator flooding by single applications

✅ **Logging and Monitoring**
- Optional security event logging for monitoring suspicious activity
- Application identification in logs for audit trails

✅ **User Control**
- All security settings configurable through preferences UI
- Users can adjust limits based on their security requirements

### Configurable Security Settings

Access via: `gnome-extensions prefs status-widget@nmalik.github.io`

- **Max Indicators per App** (1-20, default: 5)
- **Rate Limit** (50-5000ms, default: 100ms) 
- **Security Logging** (enabled by default)

### Remaining Limitations

⚠️ **Session-level D-Bus exposure** - Any application in the user session can attempt to call the interface (mitigated by validation and limits)

⚠️ **Application identification** - Basic caller identification (enhanced identification would require D-Bus policy integration)

### Best Practices

1. **Monitor logs** - Enable security logging to detect unusual activity
2. **Adjust limits** - Set appropriate per-app limits based on your usage
3. **Regular review** - Periodically check which applications are creating indicators
4. **Trusted applications** - Only use the D-Bus interface with applications you trust

### Security Monitoring

View security events in system logs:
```bash
journalctl -f -o cat | grep -i "status.*widget"
```

## Use Cases

### AI Development Tools
- **Cursor AI**: Show when code completion or analysis is running
- **GitHub Copilot**: Indicate when suggestions are being generated
- **Claude/ChatGPT**: Display when API requests are processing

### Build Systems
- **Compilation**: Track build progress for large projects
- **Deployment**: Monitor deployment status
- **Testing**: Show test execution status

### Background Processes
- **Data Processing**: Long-running data analysis tasks
- **File Operations**: Large file transfers or conversions
- **System Tasks**: Backups, syncing, or maintenance

## Integration Examples

### VS Code Extension

```javascript
// In your VS Code extension
const { exec } = require('child_process');

function setStatus(toolId, status) {
    exec(`gdbus call --session --dest org.gnome.Shell \\
        --object-path /org/gnome/shell/extensions/StatusWidget \\
        --method org.gnome.shell.extensions.StatusWidget.SetIndicatorStatus \\
        "${toolId}" "${status}"`);
}

// Usage
setStatus('cursor', 'working');  // Start working
setStatus('cursor', 'waiting');  // Waiting for input
setStatus('cursor', 'ready');    // Done
```

### Shell Script Integration

```bash
#!/bin/bash

# Set working status
gdbus call --session --dest org.gnome.Shell \
  --object-path /org/gnome/shell/extensions/StatusWidget \
  --method org.gnome.shell.extensions.StatusWidget.SetIndicatorStatus \
  "build" "working"

# Run your build
make build

# Set ready status
gdbus call --session --dest org.gnome.Shell \
  --object-path /org/gnome/shell/extensions/StatusWidget \
  --method org.gnome.shell.extensions.StatusWidget.SetIndicatorStatus \
  "build" "ready"
```

## Troubleshooting

### Extension Not Visible
- Ensure GNOME Shell version is 45 or later
- Check if extension is enabled: `gnome-extensions list --enabled`
- Restart GNOME Shell: Alt+F2, type 'r', press Enter

### D-Bus Commands Fail
- Verify the extension is running: `gnome-extensions list --enabled`
- Check D-Bus service: `gdbus introspect --session --dest org.gnome.Shell --object-path /org/gnome/shell/extensions/StatusWidget`

### Settings Not Persisting
- Ensure GSettings schema is compiled: `glib-compile-schemas ~/.local/share/gnome-shell/extensions/status-widget@nmalik.github.io/schemas/`
- Check for schema errors: `journalctl -f | grep gnome-shell`

## Development

### File Structure
```
gnome-extension-status-widget/
├── extension.js           # Main extension logic
├── prefs.js              # Preferences UI
├── metadata.json         # Extension metadata
├── stylesheet.css        # Basic styling
├── schemas/              # GSettings schema
│   └── org.gnome.shell.extensions.status-widget.gschema.xml
├── install.sh           # Installation script
├── example-client.py    # Demo script
├── package.json          # Test dependencies and scripts
├── run-tests.sh          # Test runner script
├── tests/                # Test suite
│   ├── setup.js          # Test environment setup and mocks
│   ├── status-indicator.test.js    # StatusIndicator class tests
│   ├── status-widget.test.js       # StatusWidget class tests
│   ├── extension.test.js           # Extension integration tests
│   └── client-api.test.py          # Python client API tests
├── README.md            # This file
├── REQUIREMENTS.md      # Requirements document
└── TIMELINE.md          # Development timeline and time analysis
```

### Testing

The project includes a comprehensive test suite covering multiple aspects of the extension:

#### Test Coverage

**✅ What's Tested:**
- **StatusIndicator class** - Status changes, icon updates, label management, configuration updates
- **StatusWidget class** - Adding/removing indicators, visibility management, status control
- **Extension lifecycle** - Enable/disable, settings integration, panel positioning
- **D-Bus interface** - Method calls, error handling, parameter validation
- **Settings persistence** - Configuration loading, JSON parsing, setting changes
- **Backward compatibility** - Boolean vs string status methods

**🔧 Test Types:**
- **Unit tests** - Individual class behavior and methods
- **Integration tests** - Component interaction and data flow
- **API tests** - D-Bus interface and client library functionality
- **Mock testing** - GNOME Shell APIs are fully mocked for isolated testing

#### Running Tests

**Prerequisites:**
```bash
# Install Node.js and npm for JavaScript tests
sudo dnf install nodejs npm  # Fedora
# or
sudo apt install nodejs npm  # Ubuntu

# Optional: Python D-Bus for client testing
pip install dbus-python
```

**Run Test Suite:**
```bash
# Run all tests with coverage
./run-tests.sh

# Or run individual test commands:
npm test                    # JavaScript unit tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Coverage report
```

**Manual Testing:**
```bash
# 1. Install extension
./install.sh

# 2. Enable extension
gnome-extensions enable status-widget@nmalik.github.io

# 3. Test D-Bus interface
python3 example-client.py

# 4. View extension logs
journalctl -f -o cat | grep -i "status.widget"
```

#### Test Limitations

**⚠️ What's NOT Tested:**
- **Actual GNOME Shell integration** - Tests use mocks, not real GNOME Shell
- **Visual rendering** - UI appearance and styling not validated
- **GTK4/Adw preferences UI** - Preferences interface uses real GTK components
- **D-Bus service registration** - Real D-Bus communication not tested
- **GSettings schema compilation** - Schema validation requires real glib tools
- **Multi-user/session scenarios** - Tests run in single mock environment
- **Extension installation/uninstallation** - File system operations not covered
- **Performance under load** - No stress testing with many indicators
- **Memory leaks** - No long-running memory analysis

**🐛 Known Test Gaps:**
- **Real D-Bus communication** - Tests mock D-Bus, don't test actual IPC
- **GNOME Shell version compatibility** - Mocks may not match all Shell versions
- **Extension loading errors** - Import/syntax errors in real GNOME environment
- **Settings UI interaction** - GTK preference dialogs need manual testing
- **Panel positioning edge cases** - Complex panel layout scenarios
- **Icon rendering issues** - Emoji display problems on different systems

#### Test Architecture

**Mocking Strategy:**
- **GNOME Shell APIs** - Complete mock suite in `tests/setup.js`
- **GObject/St/Gio** - Simplified mock implementations
- **Extension base class** - Mock settings and lifecycle management
- **D-Bus interface** - Mock proxy and interface objects
- **Panel components** - Mock panel boxes and positioning

**Test Organization:**
- **Unit tests** - Focus on individual class behavior
- **Integration tests** - Test component interaction patterns
- **API tests** - Validate external interfaces and contracts
- **Error handling** - Test failure scenarios and edge cases

#### Development Workflow

**Running Tests During Development:**
```bash
# Watch mode for continuous testing
npm run test:watch

# Check specific test file
npx jest tests/status-indicator.test.js

# Run with coverage
npm run test:coverage
```

**Test-Driven Development:**
1. Write test for new feature
2. Implement feature to make test pass
3. Refactor while maintaining test coverage
4. Manual test in real GNOME Shell environment

**Debugging Failed Tests:**
```bash
# Verbose test output
npm test -- --verbose

# Run single test
npx jest -t "should change to working status"

# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest tests/extension.test.js
```

## License

This project is open source. Feel free to modify and distribute according to your needs.

## Contributing

Contributions are welcome! Please ensure:
- Code follows existing patterns
- D-Bus interface remains backward compatible
- Extension works with GNOME Shell 45+
- Documentation is updated for new features
