import { api_base } from '@/external/bot-skeleton';

const waitForBlocklyReady = (): Promise<any> => {
    return new Promise(resolve => {
        const check = () => {
            if (
                window.Blockly &&
                Blockly.derivWorkspace &&
                Blockly.Blocks &&
                Object.keys(Blockly.Blocks).length > 0
            ) {
                resolve(Blockly.derivWorkspace);
            } else {
                setTimeout(check, 150);
            }
        };
        check();
    });
};

const parseXml = (xmlText: string) => {
    if (Blockly?.utils?.xml?.textToDom) {
        return Blockly.utils.xml.textToDom(xmlText);
    }

    const parser = new DOMParser();
    return parser.parseFromString(xmlText, 'text/xml');
};

export const loadFreeBotWorkspace = async (xmlPath: string) => {
    try {
        // Safety: stop running bot
        if (api_base.is_running) {
            api_base.stop();
            api_base.setIsRunning(false);
        }

        const response = await fetch(xmlPath);
        if (!response.ok) {
            throw new Error(`Failed to load bot XML: ${xmlPath}`);
        }

        const xmlText = await response.text();
        const xmlDom = parseXml(xmlText);

        // ✅ CRITICAL: wait until ALL blocks are registered
        const workspace = await waitForBlocklyReady();

        workspace.clear();
        Blockly.Xml.domToWorkspace(xmlDom, workspace);
        workspace.scrollCenter();
    } catch (error) {
        console.error('Free Bot load failed:', error);
    }
};
