![size: 0.7m](https://img.shields.io/badge/size-0.7m-blue?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIgogICAgY2xhc3M9Imljb25pZnkgaWNvbmlmeS0tbWRpIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8cGF0aCBkPSJNNSAyMGgxNHYtMkg1bTE0LTloLTRWM0g5djZINWw3IDdsNy03eiIgZmlsbD0id2hpdGUiPjwvcGF0aD4KPC9zdmc+)
![version](https://img.shields.io/visual-studio-marketplace/v/rafaelmartinez.twop?style=flat-square)
![last-updated](https://img.shields.io/visual-studio-marketplace/last-updated/rafaelmartinez.twop?style=flat-square)

# Time Wasted On this Project

Are you working on a project for so long that you can't even remember?
How much time did you put in this project?

twop provides a minimalist and configurable time counter in the statusbar that pauses when you go idle and count when you're working hard!

🔥: Working, counting time.

🐿️: Idling,  counter stopped.

The status bar counter resets everyday but the total time spent is still visible in the overview.

If you click on the statusbar item a webview wil open with a list of all your projects and advanced stats.

> All the counters and informations are stored locally, no account is required

## Features

### Status item:
![status item](images/status-item.gif)

### Time wasted modal:
![status item](images/popup.gif)


## Extension Settings

This extension contributes the following settings:

* `twop.idleTime`: (10) The amount of time in seconds before being considered idle and stopping the timer.
* Advanced settings
    * `twop.tickInterval`: (10000) The amount of time in milliseconds between each count tick.

## Release Notes

## [2.0.0]

- Bottom counter now resets everyday
- New counter system
    - fix huge counter increases if computer put in sleep mode between two ticks
    - Stored in a in-memory persistent local database
- Clicking on it opens the overview webview with
    - Project stats
    - Time spent working on that project
    - List of the other projects