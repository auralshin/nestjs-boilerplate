import { Injectable } from '@nestjs/common';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
/**
 * AwsSecretService is a service that provides methods for retrieving secrets
 * from AWS Secrets Manager.
 */
@Injectable()
export class AwsSecretService {
  private readonly secretsManager: SecretsManagerClient;

  /**
   * Creates an instance of AwsSecretService.
   * It initializes the SecretsManagerClient with the specified region.
   */
  constructor() {
    this.secretsManager = new SecretsManagerClient({ region: 'ap-south-1' });
  }
  /**
   * Retrieves the secret value from AWS Secrets Manager.
   * @returns The secret value as a string, or null if an error occurred.
   */
  async getSecret() {
    try {
      const command = new GetSecretValueCommand({ SecretId: ' _dev' });
      const response = await this.secretsManager.send(command);
      return response.SecretString;
    } catch (err) {
      return null;
    }
  }

  /**
   * Retrieves the value of a specific key from the secret.
   * @param name - The name of the key.
   * @returns The value of the key as a string, or null if the key does not exist or an error occurred.
   */
  async getValue(name: string): Promise<string | null> {
    try {
      const secretString = await this.getSecret();
      const secret = JSON.parse(secretString);
      const value = secret[name];
      return value ? value : null;
    } catch (err) {
      return null;
    }
  }
}
