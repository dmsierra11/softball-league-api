const fs = require('fs');
const path = require('path');

const entityTemplate = (componentName) => `
  import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

  @Entity()
  export class ${componentName} {
    @PrimaryGeneratedColumn()
    id: number;
  }
`;

const controllerTemplate = (componentName) => `
  import { Controller, Get, Query, Post, Body, Put, Delete, Param } from '@nestjs/common';

  @Controller('${componentName}')
  export class ${componentName}Controller {
    constructor(private readonly ${componentName}Service: ${componentName}Service) {}
  }
`;

const serviceTemplate = (componentName) => `
  import { Injectable } from '@nestjs/common';
  import { Pool } from 'pg';

  @Injectable()
  export class ${componentName}Service {
    private readonly pool: Pool;

    constructor() {
      this.pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
      });
    }
  }
`;

const moduleTemplate = (componentName) => `
  import { Module } from '@nestjs/common';
  import { ${componentName}Controller } from './${componentName}.controller';
  import { ${componentName}Service } from './${componentName}.service';

  @Module({
    imports: [],
    controllers: [${componentName}Controller],
    providers: [${componentName}Service],
  })
  export class ${componentName}Module {}
`;

const typesTemplate = (componentName) => `
  export type ${componentName} = {
    id: number;
  };
`;

const createModule = (componentName) => {
  const componentDir = path.join(process.cwd(), 'src', componentName);

  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(componentDir, `${componentName}.controller.ts`),
    controllerTemplate(componentName),
  );
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.service.ts`),
    serviceTemplate(componentName),
  );
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.module.ts`),
    moduleTemplate(componentName),
  );
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.entity.ts`),
    entityTemplate(componentName),
  );
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.types.ts`),
    typesTemplate(componentName),
  );
};

const componentName = process.argv[2];

if (!componentName) {
  console.error('Please provide a module name.');
  process.exit(1);
}

createModule(componentName);
console.log(`Module ${componentName} created successfully.`);
