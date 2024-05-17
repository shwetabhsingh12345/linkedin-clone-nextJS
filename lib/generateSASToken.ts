import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

export const containerName = "posts";

const accountName = process.env.AZURE_STORAGE_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

if (!accountName || !accountKey) {
  throw new Error("Azure Storage account name and key are required");
}

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

async function generateSASToken() {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const permissions = new BlobSASPermissions();
  permissions.write = true;
  permissions.create = true;
  permissions.read = true;

  // Set expiry date to a distant future date (e.g., 100 years from now)
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 100);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: containerClient.containerName,
      permissions: permissions,
      startsOn: new Date(), // Optionally, you can set startsOn to current time
      expiresOn: expiryDate,
    },
    sharedKeyCredential
  ).toString();

  return sasToken;
}

export default generateSASToken;
