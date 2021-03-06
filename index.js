require('dotenv').config()
const express = require('express');
const path =require('path');
const abiDecoder = require('abi-decoder');
const Web3 = require("web3");

// initialize express
const app = express();

// initialize web3
// const web3_provider_host =
//   process.env.PRODUCTION_WEB3_PROVIDER_HOST || "http://127.0.0.1";
// const web3_provider_port = process.env.PRODUCTION_WEB3_PROVIDER_PORT || 8545;
// const provider = `${web3_provider_host}:${web3_provider_port}`;

const provider = process.env.PROVIDER || 'http://127.0.0.1:8545';

const web3 = new Web3(new Web3.providers.HttpProvider(provider));

const CertificateStoreABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"certificateId","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"instituteName","type":"string"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"NewCertificate","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"certificates","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"instituteName","type":"string"},{"internalType":"uint256","name":"id","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_instituteName","type":"string"}],"name":"createRandomCertificate","outputs":[],"stateMutability":"nonpayable","type":"function"}];

abiDecoder.addABI(CertificateStoreABI);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'pug');

app.get('/tx/:txNo', (req, res) => {
    const tx = req.params.txNo;
    console.log(tx);
    if (tx != null && tx != "") {
        web3.eth.getTransaction(tx).then(data => {
            const decodedData = abiDecoder.decodeMethod(data.input);
            console.log(decodedData.params[0].value)
            res.render('tx', { txNo: tx, output: decodedData.params[0].value, instituteName: decodedData.params[1].value, blockNumber: data.blockNumber, contractAddress: data.to });
        });
    } else {
        res.render('tx', { txNo: 'Unknown Tx No.' });
    }  
});

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || 'http://127.0.0.1';

app.listen(PORT, HOST, () => console.log(`Server started on port ${PORT} and using ${provider} endpoint!`));

app.locals.env = process.env;