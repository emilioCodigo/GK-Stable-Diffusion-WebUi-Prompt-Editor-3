import { simpleTagsToCode } from '@/utils/old-parser-from-angular'
import { Box, Button, Flex, Group, Paper, Text } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { bindActionCreators } from '@reduxjs/toolkit'
import { dracula } from '@uiw/codemirror-theme-dracula'
import CodeMirror from '@uiw/react-codemirror'
import _ from 'lodash'
import React, { FC, useEffect } from 'react'
import { useTagEditor } from '../TagEditor.hook'

/**
 * @description 用來編輯代碼的編輯器，支持代碼格式化、分割、壓縮等操作，使用CodeMirror編輯器庫。
 * @returns {Object} 一個包含了編輯器內容和編輯器操作的對象。
 */
const useBlockCodeMirror = () => {
  const { dispatch, tagEditorActions, tagEditorState, currentAtomList } = useTagEditor()
  const { setInputText, submitInputText, setPrevInputText } = tagEditorActions
  const actionCreators = bindActionCreators({ setInputText, setPrevInputText, submitInputText }, dispatch)

  /**
   * @description 將新的輸入文本更新至狀態中，並保存先前輸入文本。
   * @param {string} text - 新的輸入文本。
   */
  const setNextInputText = (text: string) => {
    actionCreators.setInputText({ inputText: text })
    actionCreators.setPrevInputText({ prevInputText: text })
  }
  return { setNextInputText, currentAtomList, tagEditorState, ...actionCreators }
}

/**
 * @description 編輯代碼的主要面板，顯示代碼並且提供操作工具。
 * @returns {JSX.Element} CodeMirror代碼編輯器組件。
 */
export const BlockCodeMirror: FC = () => {
  const { currentAtomList, setNextInputText } = useBlockCodeMirror()

  useEffect(() => {
    const updatedInputText = simpleTagsToCode(currentAtomList, 'split')
    setNextInputText(updatedInputText)
  }, [currentAtomList])

  return (
    <Box className='mh-100vh h-100vh'>
      <Box>
        <Box mb='md'>
          <ControlPanel />
        </Box>
        <CodePanel />
      </Box>
    </Box>
  )
}

/**
 * CodePanel組件：顯示程式碼編輯區塊，並將輸入的程式碼反映到狀態中。
 * @description 這個組件包含一個程式碼編輯區塊，可以編輯程式碼，並且將輸入的程式碼反映到狀態中。
 */
const CodePanel: FC = () => {
  const { setInputText, tagEditorState } = useBlockCodeMirror()
  const { inputText } = tagEditorState
  const defaultText = `(masterpiece:1.2),((ultra-detail)),[1Girl]...`
  const maxHeight = 'calc(100vh - 24px)'
  return <CodeMirror value={inputText} placeholder={defaultText} maxHeight={maxHeight} onChange={(text) => setInputText({ inputText: text })} theme={dracula} />
}

/**
 * @description 編輯代碼的控制面板，包含代碼的操作工具和編輯器的一些狀態提示。
 * @returns {JSX.Element} 控制面板組件。
 */
const ControlPanel: FC = () => {
  const clipboard = useClipboard({ timeout: 500 })
  const { submitInputText, currentAtomList, tagEditorState, setNextInputText } = useBlockCodeMirror()
  const { inputText, prevInputText } = tagEditorState

  const handleSplitClick = () => {
    const nextText = simpleTagsToCode(currentAtomList, 'split')
    setNextInputText(nextText)
  }

  const handleUnderScoreClick = () => {
    const nextText = _.trim(_.replace(inputText, /[^\S\n]/g, '_'))
    setNextInputText(nextText)
  }

  const handleMinClick = () => {
    const nextText = simpleTagsToCode(currentAtomList, 'zip')
    setNextInputText(nextText)
  }

  const handleRefreshClick = () => {
    submitInputText()
  }

  const handleCopyCodeClick = () => {
    clipboard.copy(inputText)
  }

  const isSameInputText = () => {
    return prevInputText === inputText
  }

  const getDangerColor = () => {
    return isSameInputText() ? undefined : 'red'
  }

  return (
    <Paper radius='xl' p='sm'>
      <Group>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleSplitClick}>
          <Text color={getDangerColor()}>Split</Text>
        </Button>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleMinClick}>
          <Text color={getDangerColor()}>Min</Text>
        </Button>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleUnderScoreClick}>
          UnderLine
        </Button>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleCopyCodeClick}>
          CopyCode
        </Button>
        <Flex ml='auto' align='center'>
          <Text color='red' mx='md'>
            {isSameInputText() ? '' : '* Not Yet Refresh'}
          </Text>
          <Button variant='filled' w='6rem' radius='xl' color='yellow' onClick={handleRefreshClick}>
            Refresh
          </Button>
        </Flex>
      </Group>
    </Paper>
  )
}
