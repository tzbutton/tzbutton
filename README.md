# TzButton

A social experiment on the Tezos Blockchain.

## How it works

The TzButton experiment is controlled by a smart contract deployed on the Tezos blockchain. Whenever anyone presses the button three things will happen:

1. They will add 0.2 tez to the smart contract’s balance
2. The address of the sender will become the leader
3. The countdown is reset
   The address that is the leader after the countdown expired will be eligible to withdraw the total balance on the smart contract.

For more details, check the [TzButton](https://tzbutton.io) website.

## How to Run

```bash
$ npm install
$ npm start
```

## Team

This project has been created by members of the [AirGap](https://github.com/airgap-it) team during their free time.

## License

MIT
