import React from 'react';

import { Text, Title, Spacer, Box, Cover } from '../../../styles';
import util from '../../../util';
import theme from '../../../styles/theme.json';

const Resumo = ({ servicos, agendamento }) => {
  // const servico = servicos.filter(s => s._id === agendamento.servicoId)[0];

  return (
    <Box
      justify="flex-start"
      // direction="column"
      hasPadding
      background={util.toAlpha(theme.colors.muted, 5)}>
      <Box align="center">
        <Cover
          width="80px"
          height="80px"
          image="https://www.google.com/search?q=corte+de+cabelo&sxsrf=APq-WBsNoDsag6xGEaCFmOgxDz20aLSlrA:1644712738831&tbm=isch&source=iu&ictx=1&vet=1&fir=dmfs5q8Ve2ZP8M%252ClGiw6LOvgawXgM%252C_%253B0U7ZMSMMOb8TzM%252C-6gEhKqACPxcUM%252C_%253BIPZ-NfWgOMaSpM%252C0WzqK8Z2U_evxM%252C_%253B3nDQoVvjCwpfOM%252CxUy8hyX1QBkdJM%252C_%253BU0sFtXTSIP4D0M%252CDtXrbHBXtvkiFM%252C_%253BCymyLh_2eZPeYM%252C2P00MeBlxV_I9M%252C_%253B_MbnBTFb-iXRvM%252CQhuE_GryAPGt5M%252C_%253BZYxeLMa5_dsBwM%252CPnusyYjIBhMdaM%252C_%253BAbCIiO3ZRnojmM%252CxJlBEAjZLGqgOM%252C_%253BOWvXCQpnFzDyNM%252C-6gEhKqACPxcUM%252C_%253BqKrFPHBuEpMOaM%252C4wuIEM29OSOehM%252C_%253BUniTjHGKp3cWCM%252CY7q-h4TlJ95_BM%252C_%253By2tTz-NAYwMZ5M%252CRNPMlKBsTVhkcM%252C_%253B5WwVzgXpDOz4pM%252ClkNvcAGaHczkZM%252C_%253Brq89ZaqGJBYcWM%252CmP8qmnPuhUxFxM%252C_%253Bqu1egmSC6iR7yM%252C0WzqK8Z2U_evxM%252C_&usg=AI4_-kRMXLNr1WrXA1X7lN3bg7oSMx1nvQ&sa=X&sqi=2&ved=2ahUKEwi6rbi0uPv1AhWKX8AKHX0qAJ0Q9QF6BAgZEAE#imgrc=IPZ-NfWgOMaSpM"
        />
        <Box direction="column">
          <Title small bold>
            Corte de cabelo Feminino
          </Title>

          <Spacer size="4px" />
          <Text small>
            Total:{' '}
            <Text color="success" bold underline small>
              R$ 45.00
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Resumo;
