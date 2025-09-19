import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "Metric Delegation: Validate core delegation mechanisms",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const testUser = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('metric-delegator', 'record-metric', 
                [types.uint(1), types.uint(75), types.uint(chain.blockHeight), types.none()], 
                testUser.address
            )
        ]);

        // Basic validation checks
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk();
    }
});

Clarinet.test({
    name: "Metric Delegation: Permission and Access Control",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const testUser = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('metric-delegator', 'check-metric-type-validity', 
                [types.uint(1)], 
                testUser.address
            )
        ]);

        // Validate metric type validity
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectBool(true);
    }
});