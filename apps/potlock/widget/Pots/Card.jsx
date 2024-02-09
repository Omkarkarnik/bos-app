const MAX_DESCRIPTION_LENGTH = 208;
const MAX_TITLE_LENGTH = 36;

const Card = styled.a`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 45%;
  min-width: 320px;
  border-radius: 12px;
  background: white;
  box-shadow: 0px -2px 0px #464646 inset;
  border: 1px solid #292929;
  &:hover {
    text-decoration: none;
    cursor: pointer;
  }
`;

const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;
  padding: 24px;
  width: 100%;
`;

const Title = styled.div`
  color: #292929;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  word-wrap: break-word;
`;

const Description = styled.div`
  color: #292929;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  word-wrap: break-word;
`;

const Subtitle = styled.span`
  color: #7b7b7b;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  word-wrap: break-word;
`;

const { ownerId, potId, potConfig } = props;

if (!potConfig)
  return (
    <Card style={{ justifyContent: "center", alignItems: "center" }}>
      <div class="spinner-border text-secondary" role="status" />
    </Card>
  );

const {
  pot_name,
  pot_description,
  base_currency,
  public_donations_count,
  total_public_donations,
  application_start_ms,
  application_end_ms,
  public_round_start_ms,
  public_round_end_ms,
} = potConfig;
//console.log("potConfig", potConfig);

const totalAmount =
  props.SUPPORTED_FTS[base_currency.toUpperCase()].fromIndivisible(total_public_donations);

const description = !pot_description
  ? "No description"
  : pot_description.length > MAX_DESCRIPTION_LENGTH
  ? `${pot_description.slice(0, MAX_DESCRIPTION_LENGTH)}...`
  : pot_description;

const title = !pot_name
  ? "No title"
  : pot_name.length > MAX_TITLE_LENGTH
  ? `${pot_name.slice(0, MAX_TITLE_LENGTH)}...`
  : pot_name;

const now = Date.now();
const isInApplicationPeriod = application_start_ms <= now && application_end_ms > now;
const isInPublicRoundPeriod = public_round_start_ms <= now && public_round_end_ms > now;

return (
  <Card href={props.hrefWithEnv(`?tab=pot&potId=${potId}`)}>
    <CardSection style={{ borderBottom: "1px #C7C7C7 solid" }}>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </CardSection>
    <CardSection>
      <Subtitle>{public_donations_count} contributors</Subtitle>
      <Title>
        {`${totalAmount} ${base_currency.toUpperCase()} `}
        <Subtitle>Matched</Subtitle>
      </Title>
      {(isInApplicationPeriod || isInPublicRoundPeriod) && (
        <Widget
          src={`${ownerId}/widget/Pots.Tag`}
          props={{
            ...props,
            backgroundColor: isInPublicRoundPeriod ? "#F7FDE8" : "#EFFEFA",
            borderColor: isInPublicRoundPeriod ? "#9ADD33" : "#33DDCB",
            textColor: isInPublicRoundPeriod ? "#023131" : "#192C07",
            text: isInApplicationPeriod
              ? props.daysUntil(application_end_ms) + " left to Apply"
              : isInPublicRoundPeriod
              ? props.daysUntil(public_round_end_ms) + " left for Matching"
              : "",
          }}
        />
      )}
    </CardSection>
  </Card>
);
