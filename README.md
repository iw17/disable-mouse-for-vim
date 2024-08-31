# disable-mouse-for-vim

What it says is what it does.

## Features

Reverts mouse click events mistakenly triggered on VS Code text editors when using a Vim extension.

## Requirements

VS Code >= 1.92

## Extension Settings

This extension contributes the following settings:

* `disable-mouse-for-vim.intervalThreshold`: Time interval threshold in milliseconds. If the interval between two neighboring `TextEditorSelectionChangeEvent`s with type `Command` is not less than the threshold, then the latter one will be reverted.