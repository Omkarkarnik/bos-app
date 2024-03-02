const { ownerId } = props;

const RegistrySDK =
  VM.require("potlock.near/widget/SDK.registry") ||
  (() => ({
    getProjects: () => {},
  }));
const registry = RegistrySDK({ env: props.env });

const projects = registry.getProjects() || [];

const projectIds = projects
  .filter((project) => project.status === "Approved")
  .map((project) => project.id);

const Container = styled.div`
  padding: 24px 64px;

  @media screen and (max-width: 768px) {
    padding: 24px 16px;
  }
`;

return (
  <Container>
    <Widget key="feed" src={`${ownerId}/widget/Profile.Feed`} props={{ accounts: projectIds }} />
  </Container>
);
