/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import * as vscode from 'vscode';
import { UserInputUtil, IBlockchainQuickPickItem } from './UserInputUtil';
import { RuntimeTreeItem } from '../explorer/model/RuntimeTreeItem';
import { VSCodeOutputAdapter } from '../logging/VSCodeOutputAdapter';
import { FabricRuntime } from '../fabric/FabricRuntime';

export async function stopFabricRuntime(runtimeTreeItem?: RuntimeTreeItem): Promise<void> {
    let runtime: FabricRuntime;
    if (!runtimeTreeItem) {
        const chosenRuntime: IBlockchainQuickPickItem<FabricRuntime> = await UserInputUtil.showRuntimeQuickPickBox('Select the Fabric runtime to stop');
        if (!chosenRuntime) {
            return;
        }

        runtime = chosenRuntime.data;
    } else {
        runtime = runtimeTreeItem.getRuntime();
    }

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Blockchain Extension',
        cancellable: false
    }, async (progress) => {
        progress.report({ message: `Stopping Fabric runtime ${runtime.getName()}` });
        const outputAdapter: VSCodeOutputAdapter = VSCodeOutputAdapter.instance();
        await runtime.stop(outputAdapter);
    });
}
