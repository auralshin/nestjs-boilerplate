export default () => ({
  port: process.env.PORT || 3000,
});

/*
  // get an environment variable
  const dbUser = this.configService.get<string>('DATABASE_USER');
  
  // get a custom configuration value
  const dbHost = this.configService.get<string>('database.host');
  */
