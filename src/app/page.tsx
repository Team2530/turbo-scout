"use client";

import { Modal, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';

const TBA_KEY: string = "KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw";

function RegionalSelect(props: { tbaKey: string }) {

  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    fetch("https://www.thebluealliance.com/api/v3/events/2024",
      {
        headers: {
          "X-TBA-Auth-Key": props.tbaKey
        }
      }
    )
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        setEvents(data);
      });
  }, [props.tbaKey]);

  return <Select
        label="Regional"
        placeholder='2024mnmi'
        searchable
        data={events.length == 0 ? ["Loading events..."] : events.map(event => event['key'] + ": " + event['short_name'])}
      />;
}

function SetupModal(props: any) {
  const [opened, { open, close }] = useDisclosure(true);

  return <Modal opened={opened} onClose={close} title="Setup turbo-scout" centered withCloseButton={false} size="lg" overlayProps={{ blur: 1 }}>
    {/* select regional - Is there anything else? */}
    <RegionalSelect tbaKey={TBA_KEY} />
  </Modal>;
}

export default function Home() {
  return <SetupModal />;
}
