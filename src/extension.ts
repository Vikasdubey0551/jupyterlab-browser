/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/



import * as vscode from 'vscode';
const { execSync } = require('node:child_process');
const { platform} = require('os');


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
		terminal.sendText("jupyter-lab");
				
		let existingSession = execSync("jupyter-lab list | grep 'http' | tail -n 1 | cut -d '?' -f1").toString().trim();
		let file = vscode.window.activeTextEditor?.document.fileName.toString().split('/').at(-1);
		let url = existingSession + file;
		let tmpTerminal = vscode.window.createTerminal("tmp");

		if (platform() === 'darwin'){
			tmpTerminal.sendText("sleep 3; open " + url);
		}
		else {
			tmpTerminal.sendText("sleep 3; xdg-open " + url);
		}

		tmpTerminal.sendText("sleep 2;exit");
		
		terminal.hide();
		}
		else{
			let existingSession = execSync("jupyter-lab list | grep 'http' | tail -n 1 | cut -d '?' -f1").toString().trim();
			let file = vscode.window.activeTextEditor?.document.fileName.toString().split('/').at(-1);
			vscode.env.openExternal(vscode.Uri.parse(existingSession + 'lab/tree/' + file));

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
