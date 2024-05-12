
import AWS from 'aws-sdk';

/**
 * Digital Ocean Spaces Connection
 */

const spacesEndpoint = new AWS.Endpoint(process.env.REACT_APP_SPACES_ENDPOINT);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.REACT_APP_SPACES_KEY,
    secretAccessKey: process.env.REACT_APP_SPACES_SECRET
});
export default s3;