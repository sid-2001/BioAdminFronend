import { Question } from '../../types/survey-builder.type'

export function QuestionValidator(question: Question) {
  let check = false
  let validText = ''
  let checkText = question.answers && question.answers?.length > 0 && question.answers?.some((answer) => answer.question_answer_text === '')
  let checkCode = question.answers && question.answers?.length > 0 && question.answers?.some((answer) => answer.question_answer_code === '')
  let uniqueCodeCheck =
    question.answers &&
    question.answers?.length > 0 &&
    new Set(question.answers?.map((a) => a.question_answer_code)).size !== question.answers?.length

  let checkPromptCode =
    question.prompt_answer && question.prompt_answer?.length > 0 && question.prompt_answer?.some((answer: any) => answer.prompt_code === '')
  let uniquePromptCodeCheck =
    question.prompt_answer &&
    question.prompt_answer?.length > 0 &&
    new Set(question.prompt_answer?.map((a: any) => a.prompt_code)).size !== question.prompt_answer.length

  // let promptAnsCheck = question.prompt_answer && question.prompt_answer?.length > 0 && question.prompt_answer?.some((answer: any) => answer.prompt_text === "");

  if (question.question_type_id === 1 || question.question_type_id === 2 || question.question_type_id === 9) {
    if (
      question?.question_title_formatted !== '' &&
      checkText === false &&
      checkCode === false &&
      uniqueCodeCheck === false &&
      question.answers?.length > 0 &&
      question?.question_name !== ''
    ) {
      check = false
    } else {
      check = true
      if (question?.question_title_formatted === '') {
        validText = 'Question title is missing'
      }
      if (question.answers?.length <= 0) {
        validText = 'Answers required'
      }
      if (checkText) {
        validText = 'Answers text is missing'
      }
      if (checkCode) {
        validText = 'Answers code is missing'
      }
      if (uniqueCodeCheck) {
        validText = 'Answers code should be unique'
      }
      if (question?.question_name === '') {
        validText = 'Question name is missing'
      }
    }
  }

  if (question.question_type_id === 8 || question.question_type_id === 7) {
    if (
      question?.question_title_formatted !== '' &&
      checkCode === false &&
      uniqueCodeCheck === false &&
      question.answers?.length > 0 &&
      question?.question_name !== ''
    ) {
      check = false
    } else {
      check = true
      if (question?.question_title_formatted === '') {
        validText = 'Question title is missing'
      }
      if (question.answers?.length <= 0) {
        validText = 'Answers required'
      }
      if (checkCode) {
        validText = 'Answers code is missing'
      }
      if (uniqueCodeCheck) {
        validText = 'Answers code should be unique'
      }
      if (question?.question_name === '') {
        validText = 'Question name is missing'
      }
    }
  }

  if (question.question_type_id === 3 || question.question_type_id === 5 || question.question_type_id === 6 || question.question_type_id === 16) {
    if (question?.question_title_formatted !== '' && question?.question_name !== '') {
      check = false
    } else {
      check = true
      if (question?.question_title_formatted === '') {
        validText = 'Question title is missing'
      }
      if (question?.question_name === '') {
        validText = 'Question name is missing'
      }
    }
  }

  if (question.question_type_id === 12 || question.question_type_id === 13) {
    if (
      question?.question_title_formatted !== '' &&
      check === false &&
      checkCode === false &&
      uniqueCodeCheck === false &&
      checkPromptCode === false &&
      uniquePromptCodeCheck === false &&
      question.prompt_answer.length > 0 &&
      question.answers.length > 0 &&
      question?.question_name !== ''
    ) {
      check = false
    } else {
      check = true
      if (question?.question_title_formatted === '') {
        validText = 'Question title is missing'
      }

      if (question.answers?.length <= 0) {
        validText = 'Columns required'
      }
      if (checkCode) {
        validText = 'Column code is missing'
      }
      if (uniqueCodeCheck) {
        validText = 'Column code should be unique'
      }
      if (checkText) {
        validText = 'Columns text is missing'
      }
      if (question.prompt_answer.length <= 0) {
        validText = 'Rows required'
      }
      if (checkPromptCode) {
        validText = 'Row code is missing'
      }
      if (uniquePromptCodeCheck) {
        validText = 'Row code should be unique'
      }
      if (question?.question_name === '') {
        validText = 'Question name is missing'
      }
    }
  }

  if (question.question_type_id === 17) {
    if (
      checkPromptCode === false &&
      uniquePromptCodeCheck === false &&
      //&& promptAnsCheck === false
      question.prompt_answer.length > 0 &&
      question?.question_name !== ''
    ) {
      check = false
    } else {
      check = true
      if (question?.question_title_formatted === '') {
        validText = 'Question title is missing'
      }
      if (question.prompt_answer?.length <= 0) {
        validText = 'Rows required'
      }
      if (checkPromptCode) {
        validText = 'Row code is missing'
      }
      if (uniquePromptCodeCheck) {
        validText = 'Row code should be unique'
      }
      if (question?.question_name === '') {
        validText = 'Question name is missing'
      }
    }
  }

  return { check, validText }
}
