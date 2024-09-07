// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LastClick } from './lastclick';

let last: LastClick = new LastClick([]);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(`Hello! Extension 'disable-mouse-for-vim' activated.`);
    vscode.window.onDidChangeTextEditorSelection(onClick);
    vscode.window.onDidChangeActiveTextEditor(onSwitchTo);
	// Initialize last using first state
    last.switch(vscode.window.activeTextEditor);
}

// This method is called when your extension is deactivated
export function deactivate(): void {
	console.log(`Extension 'disable-mouse-for-vim' deactivated. Bye!`);
}

function onClick(event: vscode.TextEditorSelectionChangeEvent): void {
	console.log(`Selection change event received.`);
    console.log(`Kind = ${event.kind} following ${last.kind}.`);
	// Do nothing if not using Vim extension
	const vimExts: readonly (vscode.Extension<any> | undefined)[] = [
		'vscodevim.Vim',
		'asvetliakov.vscode-neovim',
	].map(vscode.extensions.getExtension);
	const hasVim: boolean = vimExts.some((ext) => ext?.isActive ?? false);
	if (!hasVim) {
		console.log(`No Vim extension found.`)
		return;
	}
    // Do nothing if a new text editor is launched
    if (event.textEditor !== last.editor) {
        console.log(`Different active text editor.`);
        return;
    }
	if (last.allows(event)) {
		console.log(`Selection change event allowed.`);
		last.update(event);
	} else {
		console.log(`Selection change event blocked.`);
		last.reject(event);
		last.restore(vscode.window.activeTextEditor);
	}
}

function onSwitchTo(editor: vscode.TextEditor | undefined): void {
    console.log(`Switch event received.`);
    last.switch(editor);
}