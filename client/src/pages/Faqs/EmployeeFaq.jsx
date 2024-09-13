import { Card, Typography, Spin } from "antd";
import Header from "../../components/Header";
import styled from "styled-components";
import Footer from "../global/Footer";
import useFetchFaq from "../../hooks/FaqHook/useFetchFaq";
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
    faq,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchFaq();

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
          title="FREQUENTLY ASKED QUESTIONS"
          subtitle="Frequently Asked questions of Local Government Unit (LGU)"
        />
        {fetchLoading ? (
            <Spin />
          ) : (
            faq.map((fq) => {
              const isExpanded = expandedIds[fq._id];
              const description = isExpanded
                ? fq.faqAnswer
                : truncateText(fq.faqAnswer, 100);

              return (
                <Card style={{ marginTop: "50px" }} key={fq._id}>
                  <BoldText>{fq.faq}</BoldText>
                  <Description>
                    {description}
                    {fq.faqAnswer.length > 100 && (
                      <ReadMoreLink onClick={() => toggleExpand(fq._id)}>
                        {isExpanded ? "Show Less" : "Read More"}
                      </ReadMoreLink>
                    )}
                  </Description>
                </Card>
              );
            })
          )}

          {fetchError && (
            <Typography type="danger">Error loading frequently asked questions.</Typography>
          )}
      </StyledCard>
    </Content>
    <Footer />
  </Wrapper>
);
};

export default EmployeePrivacyPolicy;
