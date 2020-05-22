import "jest-extended";

import { CryptoSuite } from "@packages/core-crypto";
import { calculateForgingInfo } from "@packages/core-kernel/src/utils/calculate-forging-info";
import { Interfaces } from "@packages/crypto/src";
import { devnet } from "@packages/crypto/src/networks";

afterEach(() => jest.clearAllMocks());

const mockGetBlockTimeLookup = (height: number) => {
    switch (height) {
        case 1:
            return 0;
        default:
            throw new Error(`Test scenarios should not hit this line`);
    }
};

describe("calculateForgingInfo", () => {
    it("should calculate the current forging index correctly for fixed block times", async () => {
        const milestones = [{ height: 1, blocktime: 8, activeDelegates: 4 }];

        const config = { ...devnet, milestones };

        const crypto: CryptoSuite.CryptoManager = CryptoSuite.CryptoManager.createFromConfig(
            config as Interfaces.NetworkConfig<any>,
        );

        expect(calculateForgingInfo(0, 1, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
        expect(calculateForgingInfo(7, 1, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
        expect(calculateForgingInfo(8, 2, crypto, mockGetBlockTimeLookup).currentForger).toEqual(1);
        expect(calculateForgingInfo(15, 2, crypto, mockGetBlockTimeLookup).currentForger).toEqual(1);
        expect(calculateForgingInfo(16, 3, crypto, mockGetBlockTimeLookup).currentForger).toEqual(2);
        expect(calculateForgingInfo(24, 4, crypto, mockGetBlockTimeLookup).currentForger).toEqual(3);
        expect(calculateForgingInfo(32, 5, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
        expect(calculateForgingInfo(40, 6, crypto, mockGetBlockTimeLookup).currentForger).toEqual(1);
        expect(calculateForgingInfo(48, 7, crypto, mockGetBlockTimeLookup).currentForger).toEqual(2);
        expect(calculateForgingInfo(56, 8, crypto, mockGetBlockTimeLookup).currentForger).toEqual(3);
        expect(calculateForgingInfo(64, 9, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
    });

    it("should calculate the blockTimestamp from fixed block times", async () => {
        const milestones = [{ height: 1, blocktime: 8, activeDelegates: 4 }];

        const config = { ...devnet, milestones };
        const crypto: CryptoSuite.CryptoManager = CryptoSuite.CryptoManager.createFromConfig(
            config as Interfaces.NetworkConfig<any>,
        );

        expect(calculateForgingInfo(0, 1, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(0);
        expect(calculateForgingInfo(7, 1, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(0);
        expect(calculateForgingInfo(8, 2, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(8);
        expect(calculateForgingInfo(15, 2, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(8);
        expect(calculateForgingInfo(16, 3, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(16);
        expect(calculateForgingInfo(24, 4, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(24);
        expect(calculateForgingInfo(32, 5, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(32);
        expect(calculateForgingInfo(40, 6, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(40);
        expect(calculateForgingInfo(48, 7, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(48);
        expect(calculateForgingInfo(56, 8, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(56);
        expect(calculateForgingInfo(64, 9, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(64);
    });

    it("should calculate the next forging index correctly for fixed block times", async () => {
        const milestones = [{ height: 1, blocktime: 8, activeDelegates: 4 }];

        const config = { ...devnet, milestones };
        const crypto: CryptoSuite.CryptoManager = CryptoSuite.CryptoManager.createFromConfig(
            config as Interfaces.NetworkConfig<any>,
        );

        expect(calculateForgingInfo(0, 1, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(7, 1, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(8, 2, crypto, mockGetBlockTimeLookup).nextForger).toEqual(2);
        expect(calculateForgingInfo(15, 2, crypto, mockGetBlockTimeLookup).nextForger).toEqual(2);
        expect(calculateForgingInfo(16, 3, crypto, mockGetBlockTimeLookup).nextForger).toEqual(3);
        expect(calculateForgingInfo(24, 4, crypto, mockGetBlockTimeLookup).nextForger).toEqual(0);
        expect(calculateForgingInfo(32, 5, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(40, 6, crypto, mockGetBlockTimeLookup).nextForger).toEqual(2);
        expect(calculateForgingInfo(48, 7, crypto, mockGetBlockTimeLookup).nextForger).toEqual(3);
        expect(calculateForgingInfo(56, 8, crypto, mockGetBlockTimeLookup).nextForger).toEqual(0);
        expect(calculateForgingInfo(64, 9, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
    });

    it("should calculate the currentForger index correctly for dynamic block times", async () => {
        const milestones = [
            { height: 1, blocktime: 8, activeDelegates: 4 },
            { height: 2, blocktime: 4 },
            { height: 4, blocktime: 3 },
            { height: 6, blocktime: 4 },
        ];

        const mockGetBlockTimeLookup = (height: number) => {
            switch (height) {
                case 0:
                    return 0;
                case 1:
                    return 8;
                case 3:
                    return 12;
                case 5:
                    return 19;
                default:
                    throw new Error(`Test scenarios should not hit this line`);
            }
        };

        const config = { ...devnet, milestones };
        const crypto: CryptoSuite.CryptoManager = CryptoSuite.CryptoManager.createFromConfig(
            config as Interfaces.NetworkConfig<any>,
        );

        expect(calculateForgingInfo(0, 1, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
        expect(calculateForgingInfo(7, 1, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
        expect(calculateForgingInfo(16, 4, crypto, mockGetBlockTimeLookup).currentForger).toEqual(3);
        expect(calculateForgingInfo(19, 5, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
        expect(calculateForgingInfo(22, 6, crypto, mockGetBlockTimeLookup).currentForger).toEqual(1);
        expect(calculateForgingInfo(26, 7, crypto, mockGetBlockTimeLookup).currentForger).toEqual(2);
        expect(calculateForgingInfo(30, 8, crypto, mockGetBlockTimeLookup).currentForger).toEqual(3);
        expect(calculateForgingInfo(34, 9, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
        expect(calculateForgingInfo(38, 10, crypto, mockGetBlockTimeLookup).currentForger).toEqual(1);
        expect(calculateForgingInfo(46, 12, crypto, mockGetBlockTimeLookup).currentForger).toEqual(3);
        expect(calculateForgingInfo(54, 14, crypto, mockGetBlockTimeLookup).currentForger).toEqual(1);
    });

    it("should calculate the blockTimestamp index correctly for dynamic block times", async () => {
        const milestones = [
            { height: 1, blocktime: 8, activeDelegates: 4 },
            { height: 2, blocktime: 4 },
            { height: 4, blocktime: 3 },
            { height: 6, blocktime: 4 },
        ];

        const config = { ...devnet, milestones };

        const crypto: CryptoSuite.CryptoManager = CryptoSuite.CryptoManager.createFromConfig(
            config as Interfaces.NetworkConfig<any>,
        );

        const mockGetBlockTimeLookup = (height: number) => {
            switch (height) {
                case 0:
                    return 0;
                case 1:
                    return 8;
                case 3:
                    return 12;
                case 5:
                    return 19;
                default:
                    throw new Error(`Test scenarios should not hit this line`);
            }
        };

        expect(calculateForgingInfo(0, 1, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(0);
        expect(calculateForgingInfo(7, 1, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(0);

        expect(calculateForgingInfo(8, 2, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(8);
        expect(calculateForgingInfo(11, 2, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(8);

        expect(calculateForgingInfo(12, 3, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(12);
        expect(calculateForgingInfo(15, 3, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(12);
        expect(calculateForgingInfo(16, 4, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(16);
        expect(calculateForgingInfo(17, 4, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(16);

        expect(calculateForgingInfo(19, 5, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(19);
        expect(calculateForgingInfo(21, 5, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(19);
        expect(calculateForgingInfo(22, 6, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(22);
        expect(calculateForgingInfo(25, 6, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(22);

        expect(calculateForgingInfo(26, 7, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(26);
        expect(calculateForgingInfo(29, 7, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(26);

        expect(calculateForgingInfo(30, 8, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(30);
        expect(calculateForgingInfo(33, 8, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(30);

        expect(calculateForgingInfo(34, 9, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(34);
        expect(calculateForgingInfo(38, 10, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(38);
        expect(calculateForgingInfo(46, 12, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(46);

        expect(calculateForgingInfo(53, 12, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(50);
        expect(calculateForgingInfo(54, 14, crypto, mockGetBlockTimeLookup).blockTimestamp).toEqual(54);
    });

    it("should calculate the nextForger index correctly for dynamic block times", async () => {
        const milestones = [
            { height: 1, blocktime: 8, activeDelegates: 4 },
            { height: 2, blocktime: 4 },
            { height: 4, blocktime: 3 },
            { height: 6, blocktime: 4 },
        ];

        const mockGetBlockTimeLookup = (height: number) => {
            switch (height) {
                case 0:
                    return 0;
                case 1:
                    return 8;
                case 3:
                    return 12;
                case 5:
                    return 19;
                default:
                    throw new Error(`Test scenarios should not hit this line`);
            }
        };

        const config = { ...devnet, milestones };
        const crypto: CryptoSuite.CryptoManager = CryptoSuite.CryptoManager.createFromConfig(
            config as Interfaces.NetworkConfig<any>,
        );

        expect(calculateForgingInfo(0, 1, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(7, 1, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(16, 4, crypto, mockGetBlockTimeLookup).nextForger).toEqual(0);
        expect(calculateForgingInfo(19, 5, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(22, 6, crypto, mockGetBlockTimeLookup).nextForger).toEqual(2);
        expect(calculateForgingInfo(26, 7, crypto, mockGetBlockTimeLookup).nextForger).toEqual(3);
        expect(calculateForgingInfo(30, 8, crypto, mockGetBlockTimeLookup).nextForger).toEqual(0);
        expect(calculateForgingInfo(34, 9, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(38, 10, crypto, mockGetBlockTimeLookup).nextForger).toEqual(2);
        expect(calculateForgingInfo(46, 12, crypto, mockGetBlockTimeLookup).nextForger).toEqual(0);
        expect(calculateForgingInfo(54, 14, crypto, mockGetBlockTimeLookup).nextForger).toEqual(2);
    });

    it("should calculate the currentForger index correctly for dynamic block times and changing max delegate numbers", async () => {
        const milestones = [
            { height: 1, blocktime: 4, activeDelegates: 4 },
            { height: 4, blocktime: 3 },
            { height: 6, blocktime: 5, activeDelegates: 5 },
        ];

        const crypto: CryptoSuite.CryptoManager = CryptoSuite.CryptoManager.createFromPreset("devnet");

        // @ts-ignore
        crypto.MilestoneManager.milestones = milestones;
        // @ts-ignore
        crypto.MilestoneManager.milestone = {
            index: 0,
            data: milestones[0],
        };

        const mockGetBlockTimeLookup = (height: number) => {
            switch (height) {
                case 1:
                    return 0;
                case 3:
                    return 8;
                case 5:
                    return 15;
                default:
                    throw new Error(`Test scenarios should not hit this line`);
            }
        };

        expect(calculateForgingInfo(0, 1, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
        expect(calculateForgingInfo(4, 2, crypto, mockGetBlockTimeLookup).currentForger).toEqual(1);
        expect(calculateForgingInfo(8, 3, crypto, mockGetBlockTimeLookup).currentForger).toEqual(2);
        expect(calculateForgingInfo(12, 4, crypto, mockGetBlockTimeLookup).currentForger).toEqual(3);
        expect(calculateForgingInfo(15, 5, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
        expect(calculateForgingInfo(18, 6, crypto, mockGetBlockTimeLookup).currentForger).toEqual(1);
        expect(calculateForgingInfo(23, 7, crypto, mockGetBlockTimeLookup).currentForger).toEqual(2);
        expect(calculateForgingInfo(28, 8, crypto, mockGetBlockTimeLookup).currentForger).toEqual(3);
        expect(calculateForgingInfo(33, 9, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
        expect(calculateForgingInfo(38, 10, crypto, mockGetBlockTimeLookup).currentForger).toEqual(1);
        expect(calculateForgingInfo(53, 13, crypto, mockGetBlockTimeLookup).currentForger).toEqual(4);
        expect(calculateForgingInfo(58, 14, crypto, mockGetBlockTimeLookup).currentForger).toEqual(0);
    });

    it("should calculate the nextForger index correctly for dynamic block times and changing max delegate numbers", async () => {
        const milestones = [
            { height: 1, blocktime: 4, activeDelegates: 4 },
            { height: 4, blocktime: 3 },
            { height: 6, blocktime: 5, activeDelegates: 5 },
        ];

        const crypto: CryptoSuite.CryptoManager = CryptoSuite.CryptoManager.createFromPreset("devnet");

        // @ts-ignore
        crypto.MilestoneManager.milestones = milestones;
        // @ts-ignore
        crypto.MilestoneManager.milestone = {
            index: 0,
            data: milestones[0],
        };

        const mockGetBlockTimeLookup = (height: number) => {
            switch (height) {
                case 1:
                    return 0;
                case 3:
                    return 8;
                case 5:
                    return 15;
                default:
                    throw new Error(`Test scenarios should not hit this line`);
            }
        };

        expect(calculateForgingInfo(0, 1, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(4, 2, crypto, mockGetBlockTimeLookup).nextForger).toEqual(2);
        expect(calculateForgingInfo(8, 3, crypto, mockGetBlockTimeLookup).nextForger).toEqual(3);
        expect(calculateForgingInfo(12, 4, crypto, mockGetBlockTimeLookup).nextForger).toEqual(0);
        expect(calculateForgingInfo(15, 5, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(18, 6, crypto, mockGetBlockTimeLookup).nextForger).toEqual(2);
        expect(calculateForgingInfo(23, 7, crypto, mockGetBlockTimeLookup).nextForger).toEqual(3);
        expect(calculateForgingInfo(28, 8, crypto, mockGetBlockTimeLookup).nextForger).toEqual(0);
        expect(calculateForgingInfo(33, 9, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(38, 10, crypto, mockGetBlockTimeLookup).nextForger).toEqual(2);
        expect(calculateForgingInfo(53, 13, crypto, mockGetBlockTimeLookup).nextForger).toEqual(0);
        expect(calculateForgingInfo(58, 14, crypto, mockGetBlockTimeLookup).nextForger).toEqual(1);
        expect(calculateForgingInfo(68, 15, crypto, mockGetBlockTimeLookup).nextForger).toEqual(3);
    });

    it("should calculate the currentForger index correctly for dynamic block times, changing max delegate numbers and missed slots", async () => {
        const milestones = [
            { height: 1, blocktime: 4, activeDelegates: 4 },
            { height: 4, blocktime: 3 },
            { height: 10, blocktime: 5, activeDelegates: 5 },
        ];

        const crypto: CryptoSuite.CryptoManager = CryptoSuite.CryptoManager.createFromPreset("devnet");

        // @ts-ignore
        crypto.MilestoneManager.milestones = milestones;
        // @ts-ignore
        crypto.MilestoneManager.milestone = {
            index: 0,
            data: milestones[0],
        };

        const mockGetBlockTimeLookup = (height: number) => {
            switch (height) {
                case 1:
                    return 0;
                case 3:
                    return 8;
                case 9:
                    return 42;
                default:
                    throw new Error(`Test scenarios should not hit this line`);
            }
        };

        expect(calculateForgingInfo(0, 1, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 0,
                nextForger: 1,
                blockTimestamp: 0,
                canForge: true,
            }),
        );

        expect(calculateForgingInfo(3, 1, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 0,
                nextForger: 1,
                blockTimestamp: 0,
                canForge: false,
            }),
        );

        expect(calculateForgingInfo(4, 2, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 1,
                nextForger: 2,
                blockTimestamp: 4,
                canForge: true,
            }),
        );

        expect(calculateForgingInfo(8, 3, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 2,
                nextForger: 3,
                blockTimestamp: 8,
                canForge: true,
            }),
        );

        expect(calculateForgingInfo(12, 4, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 3,
                nextForger: 0,
                blockTimestamp: 12,
                canForge: true,
            }),
        );

        expect(calculateForgingInfo(16, 4, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 0,
                nextForger: 1,
                blockTimestamp: 15,
                canForge: false,
            }),
        );

        expect(calculateForgingInfo(18, 4, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 1,
                nextForger: 2,
                blockTimestamp: 18,
            }),
        );

        expect(calculateForgingInfo(21, 5, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 2,
                nextForger: 3,
                blockTimestamp: 21,
            }),
        );

        expect(calculateForgingInfo(24, 5, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 3,
                nextForger: 0,
                blockTimestamp: 24,
            }),
        );

        expect(calculateForgingInfo(27, 6, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 0,
                nextForger: 1,
                blockTimestamp: 27,
            }),
        );

        expect(calculateForgingInfo(30, 6, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 1,
                nextForger: 2,
                blockTimestamp: 30,
            }),
        );

        expect(calculateForgingInfo(33, 7, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 2,
                nextForger: 3,
                blockTimestamp: 33,
            }),
        );

        expect(calculateForgingInfo(36, 8, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 3,
                nextForger: 0,
                blockTimestamp: 36,
            }),
        );

        expect(calculateForgingInfo(39, 9, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 0,
                nextForger: 1,
                blockTimestamp: 39,
            }),
        );

        expect(calculateForgingInfo(42, 9, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 1,
                nextForger: 2,
                blockTimestamp: 42,
            }),
        );

        expect(calculateForgingInfo(45, 10, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 2,
                nextForger: 3,
                blockTimestamp: 45,
            }),
        );
        expect(calculateForgingInfo(49, 10, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 2,
                nextForger: 3,
                blockTimestamp: 45,
            }),
        );

        expect(calculateForgingInfo(50, 11, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 3,
                nextForger: 0,
                blockTimestamp: 50,
            }),
        );

        expect(calculateForgingInfo(55, 12, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 0,
                nextForger: 1,
                blockTimestamp: 55,
            }),
        );

        expect(calculateForgingInfo(100, 19, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 4,
                nextForger: 0,
                blockTimestamp: 100,
            }),
        );

        expect(calculateForgingInfo(105, 19, crypto, mockGetBlockTimeLookup)).toEqual(
            expect.objectContaining({
                currentForger: 0,
                nextForger: 1,
                blockTimestamp: 105,
            }),
        );
    });
});
