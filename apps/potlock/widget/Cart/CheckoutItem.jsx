const { ownerId } = props;
const donationContractId = "donate.potlock.near";

const donationContractConfig = Near.view(donationContractId, "get_config", {});

const IPFS_BASE_URL = "https://nftstorage.link/ipfs/";
const CHEVRON_DOWN_URL =
  IPFS_BASE_URL + "bafkreiabkwyfxq6pcc2db7u4ldweld5xcjesylfuhocnfz7y3n6jw7dptm";
const CHEVRON_UP_URL =
  IPFS_BASE_URL + "bafkreibdm7w6zox4znipjqlmxr66wsjjpqq4dguswo7evvrmzlnss3c3vi";

const getPriceUSD = () => {
  const res = fetch(`https://api.nearblocks.io/v1/stats`, { mode: "cors" });
  return res.body.stats[0].near_price;
};

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 800px;
  background: white;
  // background: pink;
  border: 1px solid #dbdbdb;
  box-shadow: 0px -2px 0px #dbdbdb inset;
  border-radius: 6px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ItemLeft = styled.div`
  height: 100%;
  padding: 24px 16px;
  // background: green;
`;

const ItemRight = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px 24px 24px 16px;
  width: 100%;
  // background: yellow;
  border-left: 1px solid #dbdbdb;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
`;

const Title = styled.a`
  color: #2e2e2e;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  word-wrap: break-word;
`;

const Description = styled.div`
  color: #2e2e2e;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin: 16px 0px 24px 0px;
`;

const FtIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const BreakdownSummary = styled.div`
  display: flex;
  flex-direction: column;
  // justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 16px;
  cursor: pointer;
`;

const BreakdownSummaryRight = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  // background: pink;
  width: 100%;
`;

const BreakdownTitle = styled.div`
  color: #2e2e2e;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  word-wrap: break-word;
`;

const ChevronIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 8px;
`;

const BreakdownDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 8px;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px #dbdbdb solid;
  background: #fafafa;
`;

const BreakdownItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const BreakdownItemLeft = styled.div`
  color: #7b7b7b;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  word-wrap: break-word;
`;

const BreakdownItemRight = styled.div`
  display: flex;
  flex-direction: row;
  // justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

const BreakdownAmount = styled.div`
  color: #2e2e2e;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  word-wrap: break-word;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const { projectId, checked, handleCheckboxClick } = props;

const profile = props.profile || Social.get(`${projectId}/profile/**`, "final") || {};

State.init({
  showBreakdown: false,
});

const basisPointsToPercent = (basisPoints) => {
  return basisPoints / 100;
};

if (!donationContractConfig) return "";

const cartItem = props.cart[projectId];
// console.log("cartitem: ", cartItem);
const isPotDonation = !!cartItem?.potId;
// console.log("props in checkout item: ", props);

const {
  protocol_fee_basis_points: protocolFeeBasisPoints,
  referral_fee_basis_points: referralFeeBasisPoints,
  protocol_fee_recipient_account: protocolFeeRecipientAccount,
} = donationContractConfig;
const TOTAL_BASIS_POINTS = 10_000;
let projectAllocationBasisPoints = TOTAL_BASIS_POINTS - protocolFeeBasisPoints;
if (cartItem?.referrerId) {
  projectAllocationBasisPoints -= referralFeeBasisPoints;
}
const projectAllocationPercent = basisPointsToPercent(projectAllocationBasisPoints);
const projectAllocationAmount =
  (parseFloat(cartItem?.amount) * projectAllocationBasisPoints) / TOTAL_BASIS_POINTS;
const protocolFeePercent = basisPointsToPercent(protocolFeeBasisPoints);
const protocolFeeAmount =
  (parseFloat(cartItem?.amount) * protocolFeeBasisPoints) / TOTAL_BASIS_POINTS;
const referrerFeePercent = basisPointsToPercent(referralFeeBasisPoints);
const referrerFeeAmount =
  (parseFloat(cartItem?.amount) * referralFeeBasisPoints) / TOTAL_BASIS_POINTS;

console.log("cartItem: ", cartItem);

return (
  <ItemContainer>
    <ItemLeft>
      <Widget
        src={`${ownerId}/widget/Inputs.Checkbox`}
        props={{
          id: "selector-" + projectId,
          checked,
          onClick: handleCheckboxClick,
        }}
      />
    </ItemLeft>
    <ItemRight>
      <ImageContainer>
        <Widget
          src="mob.near/widget/ProfileImage"
          props={{
            accountId: projectId,
            style: {
              width: "40px",
              height: "40px",
              border: "none",
              marginRight: "24px",
            },
            className: "mb-2",
            imageClassName: "rounded-circle w-100 h-100 d-block",
            thumbnail: false,
          }}
        />
      </ImageContainer>
      <DetailsContainer>
        <Row>
          <Title href={props.hrefWithEnv(`?tab=project&projectId=${projectId}`)}>
            {profile.name ?? ""}
          </Title>
          <Widget
            src={`${ownerId}/widget/Pots.Tag`}
            props={{
              ...props,
              backgroundColor: isPotDonation ? "#FEF6EE" : "#F6F5F3",
              borderColor: isPotDonation ? "rgba(219, 82, 27, 0.36)" : "#DBDBDB",
              textColor: isPotDonation ? "#EA6A25" : "#292929",
              text: isPotDonation
                ? cartItem.potDetail
                  ? cartItem.potDetail.pot_name
                  : "-"
                : "Direct Donation",
            }}
          />
        </Row>
        <Description>{profile.description ?? ""}</Description>
        <Widget
          src={`${ownerId}/widget/Inputs.Text`}
          props={{
            label: "Amount",
            placeholder: "0",
            value: cartItem?.amount,
            onChange: (amount) => {
              amount = amount.replace(/[^\d.]/g, ""); // remove all non-numeric characters except for decimal
              if (amount === ".") amount = "0.";
              props.updateCartItem(
                projectId,
                amount,
                cartItem?.ft,
                cartItem?.price ?? getPriceUSD(),
                cartItem?.referrerId,
                cartItem?.potId,
                cartItem?.note
              ); // TODO: update this to use selected FT ID
            },
            inputStyles: {
              textAlign: "right",
              borderRadius: "0px 4px 4px 0px",
            },
            preInputChildren: (
              <Widget
                src={`${ownerId}/widget/Inputs.Select`}
                props={{
                  noLabel: true,
                  placeholder: "",
                  options: [
                    { text: "", value: "" },
                    { text: "NEAR", value: "NEAR" },
                    { text: "USD", value: "USD" },
                  ],
                  value: { text: cartItem?.ft, value: cartItem?.ft },
                  onChange: ({ text, value }) => {
                    props.updateCartItem(
                      projectId,
                      undefined,
                      value,
                      cartItem?.price ?? getPriceUSD(),
                      cartItem?.referrerId,
                      cartItem?.potId,
                      Storage.get("note")
                    );
                  },
                  containerStyles: {
                    width: "auto",
                  },
                  inputStyles: {
                    border: "none",
                    borderRight: "1px #F0F0F0 solid",
                    boxShadow: "none",
                    borderRadius: "4px 0px 0px 4px",
                    width: "auto",
                    padding: "12px 16px",
                    boxShadow: "0px -2px 0px rgba(93, 93, 93, 0.24) inset",
                  },
                  iconLeft:
                    cartItem?.ft == "NEAR" ? (
                      <FtIcon src={props.SUPPORTED_FTS[cartItem.ft].iconUrl} />
                    ) : (
                      "$"
                    ),
                }}
              />
            ),
          }}
        />
        <BreakdownSummary onClick={() => State.update({ showBreakdown: !state.showBreakdown })}>
          <BreakdownSummaryRight>
            <BreakdownTitle style={{ fontSize: "14px", lineHeight: "16px" }}>
              {state.showBreakdown ? "Hide" : "Show"} breakdown
            </BreakdownTitle>
            <ChevronIcon src={state.showBreakdown ? CHEVRON_UP_URL : CHEVRON_DOWN_URL} />
          </BreakdownSummaryRight>
          {state.showBreakdown && (
            <BreakdownDetails>
              <BreakdownItem>
                <BreakdownItemLeft>
                  Protocol fee ({protocolFeePercent}% to {protocolFeeRecipientAccount})
                </BreakdownItemLeft>
                <BreakdownItemRight>
                  <BreakdownAmount>
                    {protocolFeeAmount ? protocolFeeAmount.toFixed(3) : "-"}
                  </BreakdownAmount>
                  {cartItem?.ft == "NEAR" ? (
                    <FtIcon src={props.SUPPORTED_FTS[cartItem.ft].iconUrl} />
                  ) : (
                    props.SUPPORTED_FTS[cartItem.ft].iconUrl
                  )}
                </BreakdownItemRight>
              </BreakdownItem>
              {cartItem?.referrerId && (
                <BreakdownItem>
                  <BreakdownItemLeft>
                    Referrer fee ({referrerFeePercent}% to {cartItem?.referrerId})
                  </BreakdownItemLeft>
                  <BreakdownItemRight>
                    <BreakdownAmount>
                      {referrerFeeAmount ? referrerFeeAmount.toFixed(3) : "-"}
                    </BreakdownAmount>
                    {cartItem?.ft == "NEAR" ? (
                      <FtIcon src={props.SUPPORTED_FTS[cartItem.ft].iconUrl} />
                    ) : (
                      props.SUPPORTED_FTS[cartItem.ft].iconUrl
                    )}
                  </BreakdownItemRight>
                </BreakdownItem>
              )}
              <BreakdownItem>
                <BreakdownItemLeft>On-Chain Storage</BreakdownItemLeft>
                <BreakdownItemRight>
                  <BreakdownAmount>{"<0.010"}</BreakdownAmount>
                  {cartItem?.ft == "NEAR" ? (
                    <FtIcon src={props.SUPPORTED_FTS[cartItem.ft].iconUrl} />
                  ) : (
                    props.SUPPORTED_FTS[cartItem.ft].iconUrl
                  )}
                </BreakdownItemRight>
              </BreakdownItem>
              <BreakdownItem>
                <BreakdownItemLeft>
                  Project allocation (~{projectAllocationPercent}% to {projectId})
                </BreakdownItemLeft>
                <BreakdownItemRight>
                  <BreakdownAmount>{projectAllocationAmount.toFixed(3)}</BreakdownAmount>
                  {cartItem?.ft == "NEAR" ? (
                    <FtIcon src={props.SUPPORTED_FTS[cartItem.ft].iconUrl} />
                  ) : (
                    props.SUPPORTED_FTS[cartItem.ft].iconUrl
                  )}
                </BreakdownItemRight>
              </BreakdownItem>
            </BreakdownDetails>
          )}
        </BreakdownSummary>
      </DetailsContainer>
    </ItemRight>
  </ItemContainer>
);
