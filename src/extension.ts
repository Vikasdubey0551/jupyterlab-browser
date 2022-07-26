/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/



import * as vscode from 'vscode';
const { execSync } = require('node:child_process');


let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	const myCommandId = 'jupyterlab-browser.startServer';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		const jupyter = isJupyterServerRunning();
		if (!jupyter){
		let terminal = vscode.window.createTerminal("Jupyterlab");
		terminal.sendText("jupyter-lab");
		terminal.hide();
		}
		else{
			let existingSession = execSync("jupyter-lab list | grep 'http' | tail -n 1 | cut -d '?' -f1").toString().trim();
		 	vscode.window.showInformationMessage("Jupyterlab already running\n " + existingSession);	
		}
		
	}));

	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);


	const openFileInBrowser = 'jupyterlab-browser.openFileInBrowser';
	subscriptions.push(vscode.commands.registerCommand(openFileInBrowser, () => {
		let jupyter = isJupyterServerRunning();
		if (!jupyter){
		let terminal = vscode.window.createTerminal("Jupyterlab");
		terminal.sendText("jupyter-lab --no-browser");
		vscode.window.showInformationMessage("No session was found. So, started one. \nTry again in 5 seconds");	
		}
		else{
			let existingSession = execSync("jupyter-lab list | grep 'http' | tail -n 1 | cut -d ' ' -f1").toString().trim();
			let token = existingSession.split("?").at(-1);
			let session = existingSession.split("?").at(0);
			let file = vscode.window.activeTextEditor?.document.fileName.toString().split('/').at(-1);
			vscode.env.openExternal(vscode.Uri.parse(session + 'lab/tree/' + file + '?' + token));
		}	

	}));

	updateStatusBarItem();

}



function isJupyterServerRunning() {
	let data = execSync("jupyter-lab list | grep 'http' | wc -l").toString().trim();
	let jupyterServerRunning: Boolean = true;

	if (data === "0") {
		jupyterServerRunning = false;
	}
	return jupyterServerRunning;
} 



function updateStatusBarItem(): void {

		myStatusBarItem.text = `$(notebook) Jupyter`;
		myStatusBarItem.tooltip = `Start Jupyterlab in Browser`;
		myStatusBarItem.show();
	}
