import { Card, Typography, Spin } from "antd";
import Header from "../../components/Header";
import styled from "styled-components";
import Footer from "../global/Footer";
import useFetchPrivacyPolicy from "../../hooks/PrivacyPolicyHook/useFetchPrivacyPolicy";
import { useState } from "react";

const StyledCard = styled(Card)`
  margin: 0 100px;
  background: none;
  border: none;

  @media (max-width: 780px) {
    margin: 2px;
  }
`;

const BoldText = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

const Description = styled.p`
  font-size: 14px;
  text-align: justify;
`;

const Wrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding-bottom: 100px;
`;

const ReadMoreLink = styled.span`
  color: blue;
  cursor: pointer;
  margin-left: 5px;
`;


const EmployeePrivacyPolicy = () => {

  const {
    privacyPolicy,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchPrivacyPolicy();

  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, 200)}...`;
  };

return (
  <Wrapper>
    <Content>
      <StyledCard>
        <Header
          title="PRIVACY POLICIES"
          subtitle="Privacy Policies of Local Government Unit (LGU)"
        />
        {fetchLoading ? (
            <Spin />
          ) : (
            privacyPolicy.map((privacy) => {
              const isExpanded = expandedIds[privacy._id];
              const description = isExpanded
                ? privacy.privacyDescription
                : truncateText(privacy.privacyDescription, 100);

              return (
                <Card style={{ marginTop: "50px" }} key={privacy._id}>
                  <BoldText>{privacy.privacyTitle}</BoldText>
                  <Description>
                    {description}
                    {privacy.privacyDescription.length > 100 && (
                      <ReadMoreLink onClick={() => toggleExpand(privacy._id)}>
                        {isExpanded ? "Show Less" : "Read More"}
                      </ReadMoreLink>
                    )}
                  </Description>
                </Card>
              );
            })
          )}

          {fetchError && (
            <Typography type="danger">Error loading privacy policies.</Typography>
          )}
      </StyledCard>
    </Content>
    <Footer />
  </Wrapper>
);
};

export default EmployeePrivacyPolicy;
