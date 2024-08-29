import * as vscode from 'vscode';
import { TextEditorSelectionChangeKind as Kind } from 'vscode';
import { config } from './config';

export class LastClick {

	public time: number;
	public kind: Kind | undefined;
	public selections: readonly vscode.Selection[];

	public constructor (selections: readonly vscode.Selection[]) {
		this.time = performance.now();
		this.kind = undefined;
		this.selections = selections;
	}

	public init(editor: vscode.TextEditor | undefined): void {
		if (editor === undefined) {
			return;
		}
		this.time = performance.now();
		this.selections = editor.selections;
		console.log(`State initialized.`);
	}
	
	public allows(event: vscode.TextEditorSelectionChangeEvent): boolean {
		let interval: number = performance.now() - this.time;
		console.log(`Interval = ${interval.toFixed(3)} ms.`);
		let isValid: boolean = event.kind !== Kind.Mouse && !(
			interval <= config.intervalThreshold /* in milliseconds */ &&
			event.kind === Kind.Command && this.kind === Kind.Command
		);
		return isValid;
	}
	
	public update(event: vscode.TextEditorSelectionChangeEvent): void {
		this.time = performance.now();
		if (event.kind === undefined) {
			return;
		}
		this.kind = event.kind;
		this.selections = event.textEditor.selections;
		console.log(`State updated.`);
		for (const sel of this.selections) {
			console.log(`Updated selection ${sel.start} ${sel.end}.`);
		}
	}

	public reject(event: vscode.TextEditorSelectionChangeEvent): void {
		this.time = performance.now();
		this.kind = event.kind;
		console.log(`State update rejected.`)
		for (const sel of event.selections) {
			console.log(`Rejected selection ${sel.start} ${sel.end}.`);
		}
	}

	public restore(editor: vscode.TextEditor | undefined): void {
		if (editor === undefined) {
			console.error(`Active text editor not found.`);
			return;
		}
		this.time = performance.now();
		editor.selections = this.selections;
		console.log('State restored.');
		for (const sel of this.selections) {
			console.log(`Restored selection ${sel.start} ${sel.end}.`);
		}
	}
}