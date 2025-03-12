const axios = require('axios');
const xml2js = require('xml2js');

// Configurações da empresa fictícia
const SFMC_CLIENT_ID = 'SEU_CLIENT_ID';
const SFMC_CLIENT_SECRET = 'SEU_CLIENT_SECRET';
const SFMC_AUTH_URL = 'https://auth.exacttargetapis.com/v1/requestToken';
const SFMC_REST_BASE_URL = 'https://yourSubdomain.rest.marketingcloudapis.com';
const SFMC_SOAP_URL = 'https://yourSubdomain.soap.marketingcloudapis.com/Service.asmx';

let accessToken = '';

// 1. Autenticação na API REST do SFMC
async function authenticate() {
    try {
        const response = await axios.post(SFMC_AUTH_URL, {
            clientId: SFMC_CLIENT_ID,
            clientSecret: SFMC_CLIENT_SECRET
        });
        accessToken = response.data.accessToken;
        console.log('Autenticação bem-sucedida! Token recebido:', accessToken);
    } catch (error) {
        console.error('Erro na autenticação:', error.response.data);
    }
}

// 2. Criar um contato na lista de assinantes (Data Extension) usando API REST
async function createContact(email, firstName, lastName) {
    try {
        const response = await axios.post(`${SFMC_REST_BASE_URL}/hub/v1/dataevents/key:YOUR_DE_KEY/rowset`,
            [{
                keys: { Email: email },
                values: { FirstName: firstName, LastName: lastName }
            }],
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log('Contato criado com sucesso!', response.data);
    } catch (error) {
        console.error('Erro ao criar contato:', error.response.data);
    }
}

// 3. Recuperar contatos usando API REST
async function getContacts() {
    try {
        const response = await axios.get(`${SFMC_REST_BASE_URL}/hub/v1/dataevents/key:YOUR_DE_KEY/rowset`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log('Contatos recuperados:', response.data);
    } catch (error) {
        console.error('Erro ao recuperar contatos:', error.response.data);
    }
}

// 4. Enviar Email via API SOAP
async function sendEmail(email, emailSubject, emailContent) {
    const builder = new xml2js.Builder();
    const xmlRequest = builder.buildObject({
        Envelope: {
            $: { xmlns: 'http://schemas.xmlsoap.org/soap/envelope/' },
            Body: {
                SendEmailRequest: {
                    $: { xmlns: 'http://exacttarget.com/wsdl/partnerAPI' },
                    Messages: {
                        EmailAddress: email,
                        Subject: emailSubject,
                        Body: emailContent
                    }
                }
            }
        }
    });

    try {
        const response = await axios.post(SFMC_SOAP_URL, xmlRequest, {
            headers: { 'Content-Type': 'text/xml', 'SOAPAction': 'SendEmail' }
        });
        console.log('Email enviado com sucesso!', response.data);
    } catch (error) {
        console.error('Erro ao enviar email:', error.response.data);
    }
}

// Fluxo de execução
(async () => {
    await authenticate();
    await createContact('teste@email.com', 'João', 'Silva');
    await getContacts();
    await sendEmail('teste@email.com', 'Bem-vindo!', 'Obrigado por se inscrever!');
})();
