import { OpKind, TezosToolkit } from '@taquito/taquito'
import axios, { AxiosError, AxiosResponse } from 'axios'
import BigNumber from 'bignumber.js'

import colorsJSON from '../colors.json'

const Tezos = new TezosToolkit('https://tezos-node.prod.gke.papers.tech/')

export interface Colors {
    token_id: string
    symbol: string
    name: string
}

let colors: Colors[] = []
let colorFetchingPromise: Promise<void> | undefined = undefined

export const getColors = async (address: string): Promise<Colors[]> => {
    if (!colorFetchingPromise) {
        colorFetchingPromise = fetchColors(address)
        await colorFetchingPromise
    }
    return colors
}

export const fetchColors = async (address: string): Promise<void> => {
    console.log('FETCHING COLORS OF ', address)
    const contract = await Tezos.contract.at('KT1FyaDqiMQWg7Exo7VUiXAgZbd2kCzo3d4s')

    const requests = []

    for (let i = 0; i < 1690; i++) {
        requests.push({
            token_id: i,
            owner: address
        })
    }

    const params = await contract.methods.balance_of(
        requests,
        'KT1PhV2KXC1Nbu4qaJkcYZirzKqjNtjkNyiC'
    ).toTransferParams()

    console.log('params', params)

    const fakeSignature: string = 'sigUHx32f9wesZ1n2BWpixXz4AQaZggEtchaQNHYGRCoWNAXx45WGW2ua3apUUUAGMLPwAU41QoaFCzVSL61VaessLg4YbbP'

    const results = await Promise.all([
        axios.get(`https://tezos-node.prod.gke.papers.tech/chains/main/blocks/head/context/contracts/${address}/counter`),
        axios.get<{ chain_id: string, hash: string }>(`https://tezos-node.prod.gke.papers.tech/chains/main/blocks/head`),
    ])

    const counter = new BigNumber(results[0].data).plus(1)
    const block = results[1].data

    const body = {
        chain_id: block.chain_id,
        operation: {
            branch: block.hash,
            contents: [{
                source: address,
                kind: OpKind.TRANSACTION,
                fee: "999999",
                counter,
                gas_limit: "1040000",
                storage_limit: "60000",
                amount: '0',
                destination: params.to,
                parameters: params.parameter as any,
            }],
            signature: fakeSignature // signature will not be checked, so it is ok to always use this one
        }
    }

    const response: any = await axios
        .post(`https://tezos-node.prod.gke.papers.tech/chains/main/blocks/head/helpers/scripts/run_operation`, body, {
            headers: { 'Content-Type': 'application/json' }
        })
        .catch((runOperationError: AxiosError) => {
            console.error('runOperationError', runOperationError)
        })

    console.log('RES', response)

    const owned = response.data.contents[0].metadata.internal_operation_results[0].parameters.value.filter((el: any) => {
        return el.args[1].int === '1'
    }).map((el: any) => el.args[0].args[0].int)

    colors = owned.map((o: string) => {
        return colorsJSON.find((c) => c.token_id === Number(o))
    })

    console.log(colors)
}