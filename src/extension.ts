/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/


import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	const myCommandId = 'jupyterlab.startServer';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		let terminal = vscode.window.createTerminal("Jupyterlab");
		terminal.sendText("jupyter-lab");
		terminal.hide();
	}));

	

	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);
	
	updateStatusBarItem();
}

function updateStatusBarItem(): void {

		myStatusBarItem.text = `$(notebook) Jupyter`;
		myStatusBarItem.tooltip = `Start Jupyterlab in Browser`;
		myStatusBarItem.show();
	}
