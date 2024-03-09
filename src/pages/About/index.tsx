import styled from 'styled-components'
import '@/styles/otp-input.css'
const BgBox = styled.div`
    width: 100%;
    min-height: 100vh;
    color: #A0A5AD;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
    letter-spacing: -0.5px;
    background: linear-gradient(0deg, rgba(0, 178, 255, 0.40) 0%, rgba(12, 14, 17, 0.40) 100%);
    .banner{
        width: 100%;
        margin-bottom: 24px;
    }
    .title{
        color: #fff
    }
    .paragraph{
        margin-bottom: 24px;
    }
    .paragraph1{
        margin-bottom: 16px;
    }
    .paragraph2{
        margin-bottom: 32px;
    }
    .paragraph3{
        margin-bottom: 90px;
    }
    .before:before{
        content: '•';
        margin-right: 5px
    }
    .big{
        font-size: 32px;
    }
    .jump{
        color: #03D498
    }
    .marginLeft{
        margin-left: 30px
    }
    .tr{
        width: 80%;
        display: flex;
        justify-content: space-around;
        height: 60px;
        background: rgba(0, 0, 0, 0.40);
    }
    .th{
        background: linear-gradient(90deg, #49eaae 0%, #3f54fb 50%, #4aced7 100%);
        border-radius: 10px 10px 0 0;
    }
    .td{
        width: 150px;
        color: #FFF;
        text-align: center;
        font-family: Satoshi;
        font-size: 18px;
        font-style: normal;
        font-weight: 900;
        line-height: 24px; /* 133.333% */
        letter-spacing: -0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .last{
        border-radius: 0 0 10px 10px;
    }
    .person{
        width: 147px;
        height: 147px;
        flex-shrink: 0;
        border-radius: 8px;
        background: url(<path-to-image>), lightgray 50% / cover no-repeat;
        margin-right: 55px
    }
`
export default function About() {
    return (
        <BgBox className='relative pb-[3rem]'>
            <div className='pt-[8.5rem] pl-[6.5rem] pr-[6.88rem]'>
                <img src="/img/about-banner.svg" alt="" className='banner'/>
                <div className='paragraph'>
                zkLink Nova is the first aggregated Layer 3 ZK-Rollup network with EVM-compatibility, built on top of Ethereum and multiple Layer 2 rollup networks (L2s).
                </div>
                <div className='paragraph'>
                    <span className='title'>Participate in the Aggregation Parade Campaign to earn a share of ZKL tokens.</span> The Aggregation Parade encompasses rewards in the form of Nova Points and NFTs, all tied to the Finale Reward. Users can enhance their Nova points by contributing meaningfully to the ecosystem's growth. Activities such as early participation, holding more assets, referring more friends, and achieving higher group TVL will boost your final Nova points which impacts your final reward.
                </div>
                <div className='paragraph'>
                    <div>The campaign will be divided into two phases:</div>
                    <div className='before'>Early Bird Stage</div>
                    <div className='before'>Ecosystem Boost Stage</div>
                </div>
                <div className='paragraph'>
                In the Early Bird stage, users enjoy additional points for participating in the campaign on the zkLink Nova network.
                </div>
                <div className='paragraph1 title big'>
                How to earn Nova points?
                </div>
                <div className='paragraph'>
                You could see the detail and formula of how we calculate Nova points <span className='jump'>here</span>.
                </div>
                <div>
                    <img src="/img/img-about-rules.svg" className="w-full" />
                </div>
                <div className='paragraph'>
                    <div className='title mt-4'>Minimal Entry:</div>
                    <div>1. First 7 days 0.1 ETH</div>
                    <div>2. After Day 7th 0.25 ETH</div>
                </div>
                <div className='paragraph2'>
                    <div className='title'>Deposit / Bridge Assets to Nova</div>
                    <div>Bridging any supported assets to Nova can instantly earn Nova points. The points earned is determined by a multiple factors:</div>
                    <div>Nova Points = SUM(Deposit Value * Token Multiplier) * 10</div>
                </div>
                <div className='paragraph title'>
                To join the Aggregation Parade, make sure your deposit surpasses the Minimum Entry. 
                </div>
                <div className='paragraph'>
                    <div className='title'>Holding assets on Nova</div>
                    <div>Holding any <span className='jump'>supported assets</span> on Nova allows you to accrue Nova points until the final Nova Point computation date. Check how your Nova points are computed by holding Value here.</div>
                    <div className='before title'>Nova points update will be computed every 8 hours</div>
                </div>
                <div className='paragraph'>
                    <div className='title'>Referral Rewards</div>
                    <div>By inviting friends, you can earn 10% of the Nova points they earn throughout the duration of the Aggregation Parade. For instance, if you refer to 10 users, and collectively they earn 100 Nova points, you will also earn 10 points.</div>
                </div>
                <div className='paragraph'>
                    <div className='title'>Multiplier</div>
                    <div><span className='title'>Early Bird Multiplier:</span>During Phase 1 of the Nova Campaign, withdrawals are temporarily restricted for a <span className='title'>Maximum</span> of 30 days.</div>
                    <div className='marginLeft'>a. First week: 2x Nova Points</div>
                    <div className='marginLeft'>b. 2nd week: 1.5x Nova Points</div>
                    <div className='marginLeft'>c. 3rd & 4th week: 1.2x Nova Points</div>
                    <div className='title'>The Early Bird Multiplier concludes immediately in the event where zkLink Nova removes the withdrawal restriction.</div>
                </div>
                <div className='paragraph'>
                    <div><span className='title'>Token Multiplier:</span> Tokens are categorized into three tiers, with higher liquidity tokens receiving more Nova Points.</div>
                </div>
                <div className='paragraph'>
                    <div><span className='title'>Group Multiplier:</span> You, along with the users you've referred and their subsequent referrals, will be placed into the same group. This group has the potential to unlock Group Booster by achieving the following Milestones.</div>
                    <div>Group Booster = Group Holding Value Booster (In the Early Phase)</div>
                </div>
                <div className='paragraph'>
                    <div className='tr th'>
                        <div className='td whitespace-nowrap'>Group Tier</div>
                        <div className='td whitespace-nowrap'>Group Holding Value （ETH）</div>
                        <div className='td whitespace-nowrap'>Group Holding Value （ETH）</div>
                        <div className='td whitespace-nowrap'>Holding Value Booster</div>
                    </div>
                    <div className='tr'>
                        <div className='td'>1</div>
                        <div className='td'>{'>'}20</div>
                        <div className='td'>0.1x</div>
                    </div>
                    <div className='tr'>
                        <div className='td'>2</div>
                        <div className='td'>{'>'}100</div>
                        <div className='td'>0.2x</div>
                    </div>
                    <div className='tr'>
                        <div className='td'>3</div>
                        <div className='td'>{'>'}500</div>
                        <div className='td'>0.3x</div>
                    </div>
                    <div className='tr'>
                        <div className='td'>4</div>
                        <div className='td'>{'>'}1000</div>
                        <div className='td'>0.4x</div>
                    </div>
                    <div className='tr last'>
                        <div className='td'>5</div>
                        <div className='td'>{'>'}5000</div>
                        <div className='td'>0.5x</div>
                    </div>
                </div>
                <div className='paragraph'>
                    <div><span className='title'>Deposit Multiplier:</span> You will receive 10 times Nova points for EACH deposit/ bridging action that occurs.</div>
                </div>
                <div className='paragraph'>
                    <div><span className='title'>Group Multiplier:</span> You, along with the users you've referred and their subsequent referrals, will be placed into the same group. This group has the potential to unlock Group Booster by achieving the following Milestones.</div>
                    <div>Group Booster = Group Holding Value Booster (In the Early Phase)</div>
                </div>
                <div className='paragraph'>
                    <div className='tr th'>
                        <div className='td whitespace-nowrap'>Group Tier</div>
                        <div className='td whitespace-nowrap'>Group Holding Value （ETH）</div>
                        <div className='td whitespace-nowrap'>Group Holding Value Booster</div>
                    </div>
                    <div className='tr'>
                        <div className='td'>1</div>
                        <div className='td'>{'>'}20</div>
                        <div className='td'>0.1x</div>
                    </div>
                    <div className='tr'>
                        <div className='td'>2</div>
                        <div className='td'>{'>'}100</div>
                        <div className='td'>0.2x</div>
                    </div>
                    <div className='tr'>
                        <div className='td'>3</div>
                        <div className='td'>{'>'}500</div>
                        <div className='td'>0.3x</div>
                    </div>
                    <div className='tr'>
                        <div className='td'>4</div>
                        <div className='td'>{'>'}1000</div>
                        <div className='td'>0.4x</div>
                    </div>
                    <div className='tr last'>
                        <div className='td'>5</div>
                        <div className='td'>{'>'}5000</div>
                        <div className='td'>0.5x</div>
                    </div>
                </div>
                <div className='paragraph title big'>
                How to earn Nova NFTs?
                </div>
                <div className='paragraph'>
                    <div>You will get ONE of the FOUR Nova SBT once you bridge</div>
                    <div className='before'>0.1ETH (In the first 7 days) OR</div>
                    <div className='before'>0.25 ETH (After day 7th) into zkLink Nova</div>
                </div>
                
                {/* <div className='flex paragraph'>
                    <img src="/img/4.png" alt="" className='person'/>
                    <img src="/img/3.png" alt="" className='person'/>
                    <img src="/img/2.png" alt="" className='person'/>
                    <img src="/img/1.png" alt="" className='person'/>
                </div> */}
                <div className='mb-[1rem]'>
                    <img src="/img/img-about-info.svg" className='w-full'/>
                </div>
                <div className='paragraph'>
                    <div>After obtaining your SBT, you can upgrade it into an ERC721 NFT through collecting ONE OF EACH of the four different types of trademark NFT through our referral program.</div>
                    <div className='before'>You will get a trademark NFT airdrop for each 3 referral.</div>
                    <div className='before'>Top 100 referrer on the referral leader-board will be airdrop a Mystery Box.</div>
                </div>
                <div className='paragraph'>
                    <div>Upon Upgrading your Nova Lynks NFT, you will unlock the following utilities:</div>
                    <div className='before'>10,000,000 ZKL Airdrop</div>
                    <div className='before'>ZKL swags</div>
                    <div className='before'>Future NFT whitelist</div>
                    <div className='before'>zkLink on-site event access</div>
                </div>
                <div className='paragraph title big'>
                Timeline
                </div>
                <div className='paragraph'>
                    <div className='title'>Phase 1: Aggregation phase 3/24</div>
                    <div className='before'>Deposit all accepted token types onto NOVA to earn Nova points</div>
                </div>
                <div className='paragraph'>
                    <div className='title'>Phase 2: Claiming Phase 4/24</div>
                    <div className='before'>Nova Lynks Holders split 10,000,000 $ZKL</div>
                    <div className='before'>Nova Points computation wrap up</div>
                </div>
                <div className='paragraph'>
                    <div className='title'>Phase 3: Releasing phase 4/24</div>
                    <div className='before'>Nova Points will be released in the form of $ZKL</div>
                </div>
                <div className='paragraph title big'>
                About zkLink Nova Network
                </div>
                <div className='paragraph3'>
                zkLink Nova is the pioneering Aggregated Layer 3 Rollup zkEVM network that brings unprecedented liquidity and asset aggregation to Ethereum and its Layer 2 Rollups. Built with ZK Stack and zkLink Nexus, it leverages ZK Proofs to enhance scalability and security. Developers enjoy an open platform for deploying Solidity smart contracts, tapping into integrated networks like Arbitrum and zkSync. Nova simplifies DeFi by presenting a unified ecosystem for users and DApps, promoting a seamless blockchain experience.
                </div>
            </div>
        </BgBox>
    )
}
