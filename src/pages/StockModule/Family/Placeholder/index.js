import React from 'react';

import {
  Container,
  Cards,
  Card,
  TitlePlaceholder,
  DescriptionPlaceholder,
  Content,
  PicturePlaceholder,
  DescPlaceholder
} from './styles';

export default function Placeholder() {
  function renderCards() {
    const cardsNumber = 5;
    let cards = [];

    for (i = 0; i < cardsNumber; i++) {
      cards.push(
        <Container key={`category-card-placeholder-${i}`}>
          <Card>
            <TitlePlaceholder autoRun />
            <DescriptionPlaceholder autoRun />
            <Content>
              <PicturePlaceholder autoRun />
              <DescPlaceholder autoRun />
            </Content>
          </Card>
        </Container>
      );
    }

    return cards;
  }

  return (
    <Cards>{renderCards()}</Cards>
  );
}
