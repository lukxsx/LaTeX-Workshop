import type {ILogger} from '../../src/components/interfaces'

export class FakeLogger implements ILogger {
    addLogMessage() {}
    logCommand() {}
    addCompilerMessage() {}
    logError() {}
    logOnRejected() {}
    clearCompilerMessage() {}
    displayStatus() {}
    showErrorMessage(): Thenable<string | undefined> | undefined { return }
    showErrorMessageWithCompilerLogButton() {}
    showErrorMessageWithExtensionLogButton() {}
    showLog() {}
    showCompilerLog() {}
}