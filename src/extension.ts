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
	last.init(vscode.window.activeTextEditor);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	//const disposable = vscode.commands.registerCommand('disable-mouse-for-vim.helloWorld', () => {
	//	// The code you place here will be executed every time your command is executed
	//	// Display a message box to the user
	//	console.log('Hello World from disable-mouse-for-vim!');
	//});

	//context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate(): void {
	console.log(`Extension 'disable-mouse-for-vim' deactivated. Bye!`)
}

function onClick(event: vscode.TextEditorSelectionChangeEvent): void {
	console.log(`Event received, kind = ${event.kind} following ${last.kind}.`);
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
	if (last.allows(event)) {
		console.log(`Event allowed.`);
		last.update(event);
	} else {
		console.log(`Event blocked.`);
		last.reject(event);
		last.restore(vscode.window.activeTextEditor);
	}
}