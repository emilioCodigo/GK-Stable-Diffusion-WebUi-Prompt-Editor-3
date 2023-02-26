import { SFIcon } from '@/views/shared/SFIcon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Card, Flex, Group, HoverCard, Table, Text } from '@mantine/core'
import _ from 'lodash'
import React, { FC, ReactNode, useEffect, useState } from 'react'
interface TagCardInfo {
  name: string
}
export const TagCard: FC<TagCardInfo> = (props) => {
  const [shortName, setShortName] = useState('MasterPiece')
  const [numWeight, setNumWeight] = useState(1)
  const [bracketWeight, setBracketWeight] = useState(0)
  useEffect(() => {
    const processed = _.truncate(props.name, { omission: '...', length: 16 })
    setShortName(processed)
  }, [props])
  return (
    <Card withBorder p={0} className='overflow-visible'>
      <Table highlightOnHover className='overflow-visible'>
        <tbody>
          <tr>
            <td className='w-20'>
              <SFIcon icon='faSignature' />
            </td>
            <td>
              <WithNameHoverCard text={props.name} handleClickXIcon={() => {}}>
                <Text>{shortName}</Text>
              </WithNameHoverCard>
            </td>
          </tr>
          <tr>
            <td className='w-20'>
              <SFIcon icon='faArrowUp19' />
            </td>
            <td>
              <WithPlusMinusHoverCard handleClickMinusIcon={() => {}} handleClickPlusIcon={() => {}}>
                <Text>{numWeight}</Text>
              </WithPlusMinusHoverCard>
            </td>
          </tr>
          <tr>
            <td className='w-20'>
              <SFIcon icon='faW' />
            </td>
            <td>
              <WithPlusMinusHoverCard handleClickMinusIcon={() => {}} handleClickPlusIcon={() => {}}>
                <Text>{bracketWeight}</Text>
              </WithPlusMinusHoverCard>
            </td>
          </tr>
        </tbody>
      </Table>
    </Card>
  )
}
interface WithNumHoverCardProps {
  children: ReactNode
  handleClickPlusIcon: () => void
  handleClickMinusIcon: () => void
}
const WithPlusMinusHoverCard: FC<WithNumHoverCardProps> = (props) => {
  const { children, handleClickMinusIcon, handleClickPlusIcon } = props
  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: '2xs', className: 'pointer' }
  return (
    <HoverCard shadow='md' position='bottom-start'>
      <HoverCard.Target>{children}</HoverCard.Target>
      <HoverCard.Dropdown>
        <Group spacing='md'>
          <ActionIcon variant='filled' radius='xl' size='sm' onClick={handleClickMinusIcon}>
            <SFIcon icon='faMinus' iconProps={iconProps} />
          </ActionIcon>
          <ActionIcon variant='filled' radius='xl' size='sm' onClick={handleClickPlusIcon}>
            <SFIcon icon='faPlus' iconProps={iconProps} />
          </ActionIcon>
        </Group>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}
interface WithNameHoverCardProps {
  children: ReactNode
  text: string
  handleClickXIcon: () => void
}
const WithNameHoverCard: FC<WithNameHoverCardProps> = (props) => {
  const { children, text, handleClickXIcon } = props
  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: 'xs', className: 'pointer' }
  return (
    <HoverCard shadow='md' position='bottom-start'>
      <HoverCard.Target>{children}</HoverCard.Target>
      <HoverCard.Dropdown>
        <Flex align='center' justify='start' gap='xs'>
          <ActionIcon color='red' variant='light' size='xs' onClick={handleClickXIcon}>
            <SFIcon icon='faX' iconProps={iconProps} />
          </ActionIcon>
          <Text>{text}</Text>
        </Flex>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}