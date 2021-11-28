import { TonClient, abiContract } from "@tonclient/core";
import { libWeb, libWebSetup } from "@tonclient/lib-web";
import freeton from "freeton";
const { Account } = require("@tonclient/appkit");
const contractData = require("./contracts/ContractData.json");
import abi from "./contracts/Random.abi.json";
libWebSetup({
    binaryURL: "./tonclient.wasm",
});
TonClient.useBinaryLibrary(libWeb);

let client;
if (typeof client == 'undefined') {
    client = new TonClient({
        network: {
            server_address: "net.ton.dev",
        }
    });
}
const contract = "0:6c3900c805f28d861810bc1f18c08d1348db19ba5eb69ff6cf5ea7674b379ba5";//Random.sol contract

async function getPayload(a) {
    const response = await client.abi.encode_message_body(
        {
            abi: abiContract(abi),
            call_set: {
                function_name: "getrandom",
                input: {
                    a
                }
            },
            signer: { type: "None" },
            is_internal: true
        });
    return response.body;
}


const random = async (uWallet) => {
    try {
        const account = new Account(contractData, { address: contract, client });
        const response = await account.runLocal("getNums", { a: uWallet });
        return response.decoded.output.value0;
    } catch (e) {
        console.log(`response is: ${JSON.stringify(e, null, 4)}`);
    }
    client.close();
};
const isInstalled = () => {
    if (window.freeton === undefined) {        
        return false;
    }
    return true;
}
async function initExtraton() {   
    try {        
        const provider = new freeton.providers.ExtensionProvider(window.freeton);
        const signer = await provider.getSigner();
        const wallet = signer.getWallet()
        const payload = await getPayload(wallet.address)

        const contractMessageProcessing = await wallet.transfer(
            contract, 1e9, true, payload);

        await contractMessageProcessing.wait();

        const response = await random(wallet.address);
        console.log(response);
        return response;
    } catch (e) {
        if (!isInstalled()) {
            e.text = "<a href=\"https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm?hl=uk\">Extraton extension</a> is not available.";
            console.log('not installed');
        }
        console.log(`response is: ${JSON.stringify(e, null, 4)}`);
        $('#log').html(e.text);
        return false;
    }
}


export {
    initExtraton,
    isInstalled
}
