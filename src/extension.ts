import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  vscode.window.createTreeView("debug-configs-panel", {
    treeDataProvider: new MultiRunButtonsViewProvider(),
  });
}

export function deactivate() {}

class MultiRunButtonsViewProvider
  implements vscode.TreeDataProvider<RunButton>
{
  onDidChangeTreeData?: vscode.Event<RunButton | null | undefined> | undefined;

  getTreeItem(element: RunButton): vscode.TreeItem {
    return element;
  }

  getChildren(
    element?: RunButton | undefined
  ): vscode.ProviderResult<RunButton[]> {
    const workspaceFolder = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0]
      : undefined;
    if (!workspaceFolder) {
      return [];
    }
    const buttons = [] as RunButton[];
    // Find all the run/debug configurations
    const configurations = vscode.workspace
      .getConfiguration("launch", workspaceFolder.uri)
      .get("configurations");
    if (configurations && Array.isArray(configurations)) {
      configurations.forEach((config: vscode.DebugConfiguration) => {
        buttons.push(new RunButton(config));
      });
    }
    return buttons;
  }
}

class RunButton extends vscode.TreeItem {
  constructor(config: vscode.DebugConfiguration) {
    super(config.name, vscode.TreeItemCollapsibleState.None);
    this.command = {
      command: "workbench.action.debug.restart",
      title: config.name,
      arguments: [config],
    };
  }
}
