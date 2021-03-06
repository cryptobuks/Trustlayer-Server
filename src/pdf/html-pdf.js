const htmlPdf = require('html-pdf');
const moment = require('moment');

const config = {
  format: 'A4',
  header: {
    height: '22mm',
  },
  footer: {
    height: '22mm',
  },
};


const addLogDataToBody = (agreementBody, linkAdoption, adoption, linkUserEmail, userEmail) => {
  const {
    form_hash: linkHash,
    ip: linkIp,
    created: linkTimestamp,
  } = linkAdoption;
  const {
    form_hash: hash,
    ip,
    created: timestamp,
  } = adoption;

  const linkDate = moment.unix(linkTimestamp / 1000).format('MMMM Do, YYYY');
  const date = moment.unix(timestamp / 1000).format('MMMM Do, YYYY');

  const logHtml = `
  <br/>
  <div>
    <h2>Adoption logs</h2>
    <div>
      <p>${linkUserEmail}</p>
      <p>Adopted: ${linkDate}</p>
      <p>Public IP address: ${linkIp}</p>
      <p>Form hash: ${linkHash}</p>
    </div>
    <br/>
    <div>
      <p>${userEmail}</p>
      <p>Adopted: ${date}</p>
      <p>Public IP address: ${ip}</p>
      <p>Form hash: ${hash}</p>
    </div>
  </div>
  `;

  return agreementBody + logHtml;
};


const convertToPdf = (agreementBody, linkAdoption, adoption, linkUserEmail, userEmail) => {
  const html = addLogDataToBody(agreementBody, linkAdoption, adoption, linkUserEmail, userEmail);

  const bodyStyling = 'body { padding-left: 50px; padding-right:50px; font-size:11px; }';
  let newHTML = `<html><head><style>${bodyStyling}</style></head><body>${html}</body></html>`;
  newHTML = newHTML.replace(/(\\")/g, '"');

  return new Promise((resolve, reject) => {
    htmlPdf.create(newHTML, config).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};


module.exports = convertToPdf;
