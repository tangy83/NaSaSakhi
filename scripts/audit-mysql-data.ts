/**
 * MySQL Data Audit Script
 * Audits the existing MySQL database to understand data quality and completeness
 */

import { connectToMySQL } from './db-connect';
import * as fs from 'fs';
import * as path from 'path';

interface AuditResult {
  table: string;
  count: number;
  sampleData?: any[];
  issues?: string[];
}

async function auditTable(
  connection: any,
  tableName: string,
  sampleSize: number = 3
): Promise<AuditResult> {
  console.log(`\n📊 Auditing table: ${tableName}`);

  try {
    // Get count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as count FROM ${tableName}`
    );
    const count = countResult[0].count;
    console.log(`   Total rows: ${count}`);

    // Get sample data
    const [sampleData] = await connection.execute(
      `SELECT * FROM ${tableName} LIMIT ${sampleSize}`
    );

    // Get column info
    const [columns] = await connection.execute(
      `SHOW COLUMNS FROM ${tableName}`
    );

    console.log(`   Columns: ${columns.map((c: any) => c.Field).join(', ')}`);

    const issues: string[] = [];

    // Check for TEXT type columns (should be VARCHAR with proper length)
    const textColumns = columns.filter((c: any) => c.Type === 'text');
    if (textColumns.length > 0) {
      issues.push(`Has ${textColumns.length} TEXT columns (should be VARCHAR with length)`);
    }

    return {
      table: tableName,
      count,
      sampleData,
      issues: issues.length > 0 ? issues : undefined,
    };
  } catch (error) {
    console.error(`   ❌ Error auditing ${tableName}:`, error);
    return {
      table: tableName,
      count: 0,
      issues: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

async function auditDatabase(): Promise<void> {
  console.log('🔍 Starting MySQL Database Audit...\n');

  const connection = await connectToMySQL();
  const auditResults: AuditResult[] = [];

  try {
    // Define tables to audit (from PRD analysis)
    const tablesToAudit = [
      'language',
      'New_organisation',
      'new_organisation_branch',
      'new_service_category',
      'new_service_resource',
      'new_branch_category',
      'Organisation_Languages',
      'branch_timings',
      'country',
      'state',
      'city',
      'faith',
      'social_category',
    ];

    for (const table of tablesToAudit) {
      const result = await auditTable(connection, table);
      auditResults.push(result);
    }

    // Generate audit report
    console.log('\n\n' + '='.repeat(80));
    console.log('📋 AUDIT SUMMARY');
    console.log('='.repeat(80) + '\n');

    auditResults.forEach((result) => {
      console.log(`${result.table}:`);
      console.log(`  Rows: ${result.count}`);
      if (result.issues && result.issues.length > 0) {
        console.log(`  Issues: ${result.issues.join(', ')}`);
      }
      console.log('');
    });

    // Save detailed report to file
    const reportPath = path.join(__dirname, '../data/export/audit-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(
      reportPath,
      JSON.stringify(auditResults, null, 2),
      'utf-8'
    );
    console.log(`\n✅ Detailed audit report saved to: ${reportPath}`);

    // Key findings
    const totalOrganizations = auditResults.find(r => r.table === 'new_organisation_branch')?.count || 0;
    const totalServiceResources = auditResults.find(r => r.table === 'new_service_resource')?.count || 0;
    const totalLanguages = auditResults.find(r => r.table === 'language')?.count || 0;

    console.log('\n' + '='.repeat(80));
    console.log('🎯 KEY FINDINGS');
    console.log('='.repeat(80));
    console.log(`Organizations (branches): ${totalOrganizations}`);
    console.log(`Service Resources: ${totalServiceResources}`);
    console.log(`Languages: ${totalLanguages}`);
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Audit failed:', error);
    throw error;
  } finally {
    await connection.end();
    console.log('✅ MySQL connection closed');
  }
}

// Run audit if this script is executed directly
if (require.main === module) {
  auditDatabase()
    .then(() => {
      console.log('\n✅ Audit complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Audit failed:', error);
      process.exit(1);
    });
}

export { auditDatabase };
