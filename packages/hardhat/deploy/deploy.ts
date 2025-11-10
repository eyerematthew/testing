import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const feeCollector = deployer;
  const feeBasisPoints = 30;

  const complianceModule = await deploy("ComplianceModule", {
    from: deployer,
    args: [deployer, deployer],
    log: true,
  });

  console.log(`ComplianceModule deployed at: ${complianceModule.address}`);

  const encryptedOrderbook = await deploy("EncryptedOrderbook", {
    from: deployer,
    args: [deployer],
    log: true,
  });

  console.log(`EncryptedOrderbook deployed at: ${encryptedOrderbook.address}`);

  const otcMarketplace = await deploy("OTCMarketplace", {
    from: deployer,
    args: [feeCollector, feeBasisPoints],
    log: true,
  });

  console.log(`OTCMarketplace deployed at: ${otcMarketplace.address}`);
};

export default func;
func.id = "deploy_otc_marketplace";
func.tags = ["OTCMarketplace"];
