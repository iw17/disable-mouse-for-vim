import { workspace } from 'vscode'

const root = workspace.getConfiguration('disable-mouse-for-vim');

export const config = {
	intervalThreshold: root.get<number>('intervalThreshold') ?? 30,
};