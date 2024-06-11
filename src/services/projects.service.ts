import { ActivityLogs, Project, ProjectFiles, ProjectTeamMemberMail, ProjectThreadType } from '@/types/project.type'
import { BaseService } from './base.service'
import api1 from './apis/api1'
import { Question, Section } from '@/types/survey-builder.type'
import { ThemeTypes } from '@/types/builder-theme-type'
import { ProjectTeamMemberResponse, ProjectTeamMember } from '@/types/project.type'
import { FilesTypes } from '@/components/project-media-upload-modal/project-media-upload-modal.type'

class ProjectService extends BaseService {
  Projects = '/projects'
  Clients = '/clients'
  Activity = '/activity-logs'
  Threads = 'threads'
  Surveys = 'surveys'

  //file list
  // integration not done

  async get_project_files(projectId: string | undefined, surveyId: number, file_types: Array<number>): Promise<ProjectFiles[]> {
    try {
      let query = ''
      if (file_types?.length > 0) {
        query = '?file_type_ids=' + file_types.join(',')
      }
      console.log(query)
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/files${query}`)
      return data
    } catch (error) {
      throw error
    }
  }
  async get_project_questionnaire_html(projectId: string, surveyId: number): Promise<string> {
    try {
      let output_url = '' //put sample here
      let payload = {
        project_id: projectId,
        survey_id: surveyId,
      }
      const { data } = await api1.post(`${this.Projects}/${projectId}/attachment/html`, payload)
      output_url = data.file_url
      return output_url
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  //members-CRUD

  async get_project_team_members(projectId: string | undefined): Promise<ProjectTeamMemberResponse[]> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/team-members`)
      return data
    } catch (error) {
      throw error
    }
  }

  async update_roles(project_id: string, team_member_id: string, role_id: number): Promise<any> {
    try {
      const { data } = await api1.patch(`${this.Projects}/${project_id}/team-members/${team_member_id}`, { role_id: role_id })
      return data
    } catch (error) {
      throw error
    }
  }

  async delete_team_member(project_id: string, team_member_id: string): Promise<any> {
    try {
      const { data } = await api1.del(`${this.Projects}/${project_id}/team-members/${team_member_id}`, {})
      return data
    } catch (error) {
      throw error
    }
  }

  async post_project_team_member(projectId: string, obj: ProjectTeamMember[]): Promise<any> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/team-members`, {
        team_members: obj,
      })
      return data
    } catch (error) {
      throw error
    }
  }

  async post_project_team_member_mail(projectId: string, obj: ProjectTeamMemberMail[]): Promise<any> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/team-members/invite`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async projectFilterList(obj: { statuses: number[]; clients: number[] }): Promise<Array<Project>> {
    try {
      // const { data } = await api1.get(`${this.Projects}`);
      const { data } = await api1.post(`${this.Projects}/list`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async post_project(obj: {
    client_id: number | null
    project_name: string
    project_code: string
    status_id: number | null
    project_description: string
    market_id: number[]
  }): Promise<Project> {
    try {
      const { data } = await api1.post(`${this.Projects}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }
  async post_effort(
    surveyId: number,
    obj: { title: string; description: string; cost: string; effort: number | null; project_id: string | undefined },
  ): Promise<any> {
    try {
      const { data } = await api1.post(`${this.Projects}/${obj.project_id}/${this.Surveys}/${surveyId}/create/efforts`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_projects(): Promise<Project[]> {
    try {
      const { data } = await api1.get(`${this.Projects}`)

      console.log(data)

      return data
    } catch (error) {
      throw error
    }
  }

  async get_clients(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Clients}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_market_with_projectId(projectId: string): Promise<any[]> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/market-list`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_project_status(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Clients}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_project_by_id(project_id: number): Promise<Project> {
    try {
      const { data } = await api1.get(`${this.Projects}/${project_id}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async put_project(
    project_id: string,
    obj: {
      client_id: number | null
      project_name: string
      project_code: string
      status_id: number | null
      project_description: string
      market_id: number[]
      sp_document_url: string
      // projectId:number
    },
  ): Promise<Project> {
    try {
      const { data } = await api1.put(`${this.Projects}/${project_id}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }
  async put_effort(
    surveyId: number,
    obj: {
      projectId: number
      title: string
      description: string
      cost: number
      effort: number
    },
    effortId: number,
  ): Promise<any> {
    try {
      console.log(obj.projectId)
      const { data } = await api1.put(`projects/${obj.projectId}/${this.Surveys}/${surveyId}/update/efforts/${effortId}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async delete_effort(project_id: string, effortId: number): Promise<void> {
    try {
      const { data } = await api1.del(`projects/${project_id}/efforts/${effortId}`, {})
      return data
    } catch (error) {
      throw error
    }
  }

  async postProjectAttachments(formData: any, onUploadProgress: any): Promise<any> {
    try {
      const { data } = await api1.upload(`${this.Projects}/attachment`, formData, onUploadProgress)
      return data
    } catch (error) {
      throw error
    }
  }

  async postSurveyMaterialAttachments(project_id: number, surveyId: number, formData: any, handleUploadProgress: any): Promise<any> {
    try {
      const { data } = await api1.upload(
        `${this.Projects}/${project_id}/${this.Surveys}/${surveyId}/materials-attachment`,
        formData,
        handleUploadProgress,
      )
      return data
    } catch (error) {
      throw error
    }
  }

  async downloadProjectPipeline(project_id: number, surveyId: number, pipeline_id: number, run_id: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${project_id}/${this.Surveys}/${surveyId}/data/${pipeline_id}/run/${run_id}/data-tabulation`)
      return data
    } catch (error) {
      throw error
    }
  }

  async project_type_change(projectId: string, obj: any): Promise<void> {
    try {
      const { data } = await api1.patch(`${this.Projects}/${projectId}/type`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async project_status_change(surveyId: number, obj: any): Promise<void> {
    try {
      const { data } = await api1.patch(`${this.Surveys}/${surveyId}/status`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async delete_project(project_id: string): Promise<void> {
    try {
      const { data } = await api1.del(`${this.Projects}/${project_id}`, {})
      return data
    } catch (error) {
      throw error
    }
  }

  async get_project_template(project_id: string, surveyId: number): Promise<Section[]> {
    try {
      const { data } = await api1.get(`${this.Projects}/${project_id}/${this.Surveys}/${surveyId}/templates`)
      let response = data.map((section: Section) => {
        return {
          section_id: section.section_id,
          survey_version: section.survey_version,
          section_name: section.section_name,
          description: section.description,
          section_sort_order: section.section_sort_order,
          number_of_questions: section.number_of_questions,
          is_template_section: section.is_template_section,
          is_recommended: section?.is_recommended ? true : false,
          is_required: section?.is_required ? true : false,
          is_optional: section?.is_optional ? true : false,
          is_template_question: section.is_template_question,
          section_code: section.section_code,
          programming_notes: section?.programming_notes,
          questions: section?.questions
            ?.filter((question: Question) => question.question_type_id !== -1 && question.question_type_id !== 14)
            .map((question: any) => {

              const updateFileUrl = (item: any) => ({
                ...item,
                file_url: item?.watermark_file_url ? item?.watermark_file_url : item?.file_url
              });

              const updatedConcept = question?.concept
                ? updateFileUrl(question.concept)
                : null;

              return {
                question_data_code: question?.question_data_code,
                question_time: question.question_time,
                question_name: question.question_name,
                question_title: question.question_title,
                question_title_formatted: question.question_title_formatted,
                concept: updatedConcept,
                description: question.description,
                programming_notes: question.programming_notes,
                can_have_quota: question.can_have_quota,
                instructions: question.instructions,
                field_width: question.field_width,
                default_value: question.default_value,
                image_width: question.image_width,
                image_height: question.image_height,
                auto_check_other: question.auto_check_other,
                default_answer_pre_code: question.default_answer_pre_code,
                open_text_coding_field: question.open_text_coding_field,
                refused_answer_pre_code: question.refused_answer_pre_code,
                input_prefix: question.input_prefix,
                input_suffix: question.input_suffix,
                equals_representation: question.equals_representation,
                answer_required_type: question.answer_required_type,
                ordered: question.ordered,
                rank_by_click: question.rank_by_click,
                open_text: question.open_text,
                is_numeric: question.is_numeric,

                no_of_rows: question.no_of_rows,
                rows: question.no_of_rows,
                carousel: question.carousel,
                question_sort_order: question.question_sort_order,
                precision_value: question.precision_value,
                lower_limit: question.lower_limit,
                upper_limit: question.upper_limit,
                auto_sum: question.auto_sum,
                lower_limit_type: question.lower_limit_type,
                upper_limit_type: question.upper_limit_type,
                multi_sum_equal: question?.auto_sum && question?.multi_sum_equal ? question?.multi_sum_equal : '',
                transpose: question.transpose,
                max_diff: question.max_diff,
                answer_text_position: question.answer_text_position,
                is_active: question.is_active,
                answer_sorting_order: question.answer_sorting_order,
                prompt_sorting_order: question.question_part_sorting_order ? question.question_part_sorting_order : 1,
                prompt_group_sorting_order: question.prompt_group_sorting_order ? question.prompt_group_sorting_order : 1,
                // extended
                parent_id: question.parent_id,
                child_sort_order: question.child_sort_order,
                required_question: question.required_question,
                question_id: question.question_id,
                question_category_id: question.question_category_id,
                question_category: question.question_category,
                question_code: question.question_code,
                question_type_id: question.question_type_id,
                capture_order: question.capture_order,
                // no_of_rows: question.no_of_rows,
                columns: question.no_of_columns,
                no_of_columns: question.no_of_columns,
                survey_question_id: question.survey_question_id,
                sorting_order: question.sort_order ? question.sort_order : 1,
                answers: question?.answers?.map((answer: any) => {
                  const updatedAnswerConcept = answer?.concept
                    ? updateFileUrl(answer.concept)
                    : null;

                  return {
                    id: answer.id,
                    question_id: answer.question_id,
                    answer_id: answer.id,
                    question_answer_id: answer.id,
                    question_answer_code: answer.question_answer_code,
                    question_answer_data_code: answer.question_answer_data_code,
                    question_answer_text: answer.question_answer_text,
                    term_condition: answer.term_condition,
                    language_id: answer.language_id,
                    style_name: answer.style_name,
                    answer_punch_type: answer.answer_punch_type,
                    style_background_color: answer.style_background_color,
                    add_other_option: answer.add_other_option,
                    keep_answer_position: answer.keep_answer_position,
                    lock_position: answer.keep_answer_position,
                    answer_sort_order: answer.answer_sort_order,
                    // concept: answer.concept?.id ? answer.concept : null,
                    concept: updatedAnswerConcept,
                    sort_order: answer.sort_order,
                    is_active: answer.is_active,
                    add_other_field: answer.add_other_field,
                    is_exclusive: answer.is_exclusive,
                    ae: answer.ae ? answer.ae : false,
                    is_terminate: answer.is_terminate ? answer.is_terminate : false,
                    analysis_group: answer.analysis_group ? answer.analysis_group : '',
                    sub_class: answer.sub_class ? answer.sub_class : '',
                    class: answer.class ? answer.class : '',
                  }
                }),
                prompt_answer:
                  question?.question_parts &&
                  question?.question_parts?.map((val: any, index: number) => {
                    return {
                      prompt_id: val.id ? val.id : index + 1,
                      prompt_code: val.pre_code,
                      prompt_text: val.question_text,
                      add_other_option: val.add_other_option ? val.add_other_option : false,
                      keep_answer_position: val.keep_question_part_position ? val.keep_question_part_position : false,
                      sort_order: val.sort_order,
                      is_active: val.is_active,
                      is_exclusive: val.is_exclusive ? val.is_exclusive : false,
                      concept: val.concept?.id ? val.concept : null,
                    }
                  }),
              }
            }),
        }
      })
      return response
    } catch (error) {
      throw error
    }
  }

  async update_project_builder_question(
    project_id: string,
    surveyId: number,
    questionId: string,
    parent_id: any,
    sectionId: string,
    child_sort_order: number,
    data: any,
    question_sort_order?: number,
  ): Promise<Section[]> {
    const regex = /(<([^>]+)>)/gi
    let payload: any = {
      section_id: Number(sectionId),
      question_sort_order: question_sort_order,
      sort_order: question_sort_order,
      question_type_id: Number(data?.question_type_id),
      parent_id: parent_id ? parent_id : null,
      child_sort_order: child_sort_order ? child_sort_order : null,
      // question_category_id: Number(data?.question_category_id),
      question_code: data?.question_code,
      question_data_code: data?.question_data_code,
      // question_data_code: data?.question_name,
      question_name: data?.question_name,
      question_title: data?.question_title_formatted.replace(regex, ''),
      question_title_formatted: data?.question_title_formatted,
      concept_id: data?.concept_id,
      can_have_quota: data?.can_have_quota,
      answer_sorting_order: Number(data.answer_sorting_order),
      no_of_columns: Number(data.no_of_columns) || Number(data?.columns),
      precision_value: Number(data?.precision_value),
      no_of_rows: Number(data?.no_of_rows),
      programming_notes: data.programming_notes,
      description: data.description,
      instructions: data.instructions,
      required_question: data.required_question,
      input_prefix: data.input_prefix,
      upper_limit: data.upper_limit === '' || data.upper_limit === null ? null : Number(data.upper_limit),
      lower_limit: data.lower_limit === '' || data.upper_limit === null ? null : Number(data.lower_limit),
      capture_order: data.capture_order,
      input_suffix: data.input_suffix,
      prompt_group_sorting_order: data.prompt_group_sorting_order,
      question_part_sorting_order: data.prompt_sorting_order,
      question_time: Number(data.question_time),
      auto_sum: data.auto_sum,
      lower_limit_type: data.lower_limit_type,
      upper_limit_type: data.upper_limit_type,
      multi_sum_equal: data?.auto_sum && data?.multi_sum_equal ? Number(data?.multi_sum_equal) : 0,
    }
    payload.answers = data?.answers?.map((value: any) => {
      return {
        id: value.id ? value.id : null,
        question_answer_id: value.question_answer_id ? value.question_answer_id : null,
        question_answer_code: value.question_answer_code,
        question_answer_text: value.question_answer_text,
        add_other_option: value.add_other_option ? value.add_other_option : false,
        keep_answer_position: value.keep_answer_position ? value.keep_answer_position : false,
        sort_order: Number(value.sort_order),
        is_terminate: value.is_terminate ? value.is_terminate : false,
        is_exclusive: value.is_exclusive ? value.is_exclusive : false,
        ae: value.ae ? value.ae : false,
        is_active: value.is_active,

        concept_id: value.concept_id ? value.concept_id : value?.concept?.id ? value?.concept?.id : null,

        analysis_group: value.analysis_group ? value.analysis_group : null,
        sub_class: value.sub_class ? value.sub_class : null,
        class: value.class ? value.class : null,
      }
    })
    payload.question_parts = data?.prompt?.map((value: any, index: number) => {
      return {
        id: value.prompt_id ? value.prompt_id : null,
        pre_code: value.prompt_code,
        question_text: value.prompt_text,
        add_other_option: value.add_other_option ? value.add_other_option : false,
        keep_question_part_position: value.keep_answer_position ? value.keep_answer_position : false,
        sort_order: value.sort_order,
        is_exclusive: value.is_exclusive ? value.is_exclusive : false,
        is_active: value.is_active,
        question_level: index,
        concept_id: value.concept_id ? value.concept_id : value?.concept?.id ? value?.concept?.id : null,
      }
    })
    try {
      const { data } = await api1.put(`${this.Projects}/${project_id}/${this.Surveys}/${surveyId}/templates/update/question/${questionId}`, {
        ...payload,
        question_id: questionId,
      })
      return data
    } catch (error) {
      throw error
    }
  }

  async add_project_builder_question(
    project_id: string,
    surveyId: number,
    section_id: string,
    data: any,
    parent_id?: string,
    child_sort_order?: number | null,
    question_sort_order?: number,
  ): Promise<Section[]> {
    const regex = /(<([^>]+)>)/gi
    let payload: any = {
      section_id: section_id,
      question_sort_order: question_sort_order,
      sort_order: question_sort_order,
      question_type_id: Number(data?.question_type_id),
      parent_id: parent_id ? parent_id : null,
      child_sort_order: child_sort_order ? child_sort_order : null,
      // question_category_id: Number(data?.question_category_id),
      // question_data_code: data?.question_name,
      question_data_code: data?.question_data_code,
      question_code: data?.question_code,
      question_name: data?.question_name,
      question_title: data?.question_title_formatted.replace(regex, ''),
      question_title_formatted: data?.question_title_formatted,
      concept_id: data?.concept_id,
      can_have_quota: data?.can_have_quota,
      answer_sorting_order: Number(data.answer_sorting_order),
      no_of_columns: Number(data.no_of_columns) || Number(data?.columns),
      precision_value: Number(data?.precision_value),
      no_of_rows: Number(data?.no_of_rows),
      programming_notes: data.programming_notes,
      description: data.description,
      instructions: data.instructions,
      required_question: data.required_question,
      input_prefix: data.input_prefix,
      upper_limit: data.upper_limit === '' || data.upper_limit === null ? null : Number(data.upper_limit),
      lower_limit: data.lower_limit === '' || data.upper_limit === null ? null : Number(data.lower_limit),
      capture_order: data.capture_order,
      input_suffix: data.input_suffix,
      prompt_group_sorting_order: data.prompt_group_sorting_order,
      question_part_sorting_order: data.prompt_sorting_order,
      question_time: Number(data.question_time),
      auto_sum: data.auto_sum,
      lower_limit_type: data.lower_limit_type,
      upper_limit_type: data.upper_limit_type,
      multi_sum_equal: data?.auto_sum && data?.multi_sum_equal ? Number(data?.multi_sum_equal) : 0,
    }
    payload.answers = data?.answers?.map((value: any) => {
      return {
        id: value.id ? value.id : null,
        question_answer_id: value.question_answer_id ? value.question_answer_id : null,
        question_answer_code: value.question_answer_code,
        question_answer_text: value.question_answer_text,
        add_other_option: value.add_other_option ? value.add_other_option : false,
        keep_answer_position: value.keep_answer_position ? value.keep_answer_position : false,
        sort_order: Number(value.sort_order),
        is_terminate: value.is_terminate ? value.is_terminate : false,
        is_exclusive: value.is_exclusive ? value.is_exclusive : false,
        ae: value.ae ? value.ae : false,
        is_active: value.is_active,
        concept_id: value.concept_id ? value.concept_id : null,

        analysis_group: value.analysis_group ? value.analysis_group : null,
        sub_class: value.sub_class ? value.sub_class : null,
        class: value.class ? value.class : null,
      }
    })
    payload.question_parts = data?.prompt?.map((value: any, index: number) => {
      return {
        id: value.prompt_id ? value.prompt_id : null,
        pre_code: value.prompt_code,
        question_text: value.prompt_text,
        add_other_option: value.add_other_option ? value.add_other_option : false,
        keep_question_part_position: value.keep_answer_position ? value.keep_answer_position : false,
        sort_order: value.sort_order,
        is_active: value.is_active,
        is_exclusive: value.is_exclusive ? value.is_exclusive : false,
        question_level: index,
        concept_id: value.concept_id ? value.concept_id : value?.concept?.id ? value?.concept?.id : null,
      }
    })
    try {
      const { data } = await api1.post(`${this.Projects}/${project_id}/${this.Surveys}/${surveyId}/templates/add/question`, payload)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_activity_logs(object_id: number, object_type_id: number): Promise<Array<ActivityLogs>> {
    try {
      const data = await api1.get(`${this.Activity}?object_id=${object_id}&object_type_id=${object_type_id}`)
      return data
    } catch (error) {
      throw error
    }
  }
  async add_project_builder_section(
    obj: {
      section_name: string
      section_code: string
      description: string
      sort_order: number
    },
    projectId: string,
    surveyId: number,
  ): Promise<Project> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/add/sections`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async update_project_builder_section(
    obj: {
      section_name: string
      section_code: string
      description: string
      sort_order: number
    },
    projectId: string,
    surveyId: number,
    sectionId: string,
  ): Promise<Project> {
    try {
      const { data } = await api1.put(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/update/sections/${sectionId}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async del_project_builder_section(projectId: string, surveyId: number, sectionId: string): Promise<Array<ActivityLogs>> {
    try {
      const data = await api1.del(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/sections/destroy/${sectionId}`, {})

      return data
    } catch (error) {
      throw error
    }
  }

  async del_project_builder_question(projectId: string, surveyId: number, sectionId: string, questionId: string): Promise<Array<ActivityLogs>> {
    try {
      const data = await api1.del(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/builders/sections/${sectionId}/destroy/questions/${questionId}`,
        {},
      )

      return data
    } catch (error) {
      throw error
    }
  }

  async project_xml_export(
    surveyId: number,
    obj: { sp_id: string; project_id: string },
  ): Promise<{ absolute_path: string; file_name: string; log_file_path: string }> {
    try {
      const { data } = await api1.post(`${this.Projects}/${obj.project_id}/${this.Surveys}/${surveyId}/questionnaire/xml`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async sort_project_builder_section(
    obj: {
      section_id: number
      sort_order: number
    }[],
    projectId: string,
    surveyId: number,
  ): Promise<Array<ActivityLogs>> {
    try {
      const data = await api1.patch(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/update/order/sections`, obj)

      return data
    } catch (error) {
      throw error
    }
  }

  async sort_project_builder_question(
    obj: {
      question_id: number
      sort_order: number
    }[],
    projectId: string,
    surveyId: number,
    sectionId: string,
  ): Promise<Array<ActivityLogs>> {
    try {
      const data = await api1.patch(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/sections/${sectionId}/update/order/question`, obj)

      return data
    } catch (error) {
      throw error
    }
  }

  async postProjectFiles(project_id: number, formData: any, handleUploadProgress: any): Promise<any> {
    try {
      const { data } = await api1.upload(`${this.Projects}/${project_id}/xmlparser`, formData, handleUploadProgress)
      return data
    } catch (error) {
      throw error
    }
  }

  async createProjectThreadsById(
    projectId: number,
    surveyId: number,
    thread_title: string,
    question_id: number,
    question_name: string,
    question_title: string,
  ): Promise<ProjectThreadType> {
    console.log(thread_title)

    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.Threads}`, {
        thread_title: thread_title,
        questions: [
          {
            question_id: question_id,
            question_name: question_name,
            question_title: question_title || '',
          },
        ],
      })

      return data
    } catch (error) {
      throw error
    }
  }

  async updateProjectThreadsQuestions(projectId: number | string, surveyId: number, threadId: number | string, questions: any) {
    try {
      await api1.put(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.Threads}/${threadId}/questions`, {
        questions,
      })
    } catch (error) {
      throw error
    }
  }

  async get_question_theme(project_id: number): Promise<ThemeTypes[]> {
    try {
      const { data } = await api1.get(`${this.Projects}/${project_id}/theme`)
      return data
    } catch (error) {
      throw error
    }
  }
  // integration not done
  async postProjectDefinitionFile(project_id: number, surveyId: number, formData: any, handleUploadProgress: any): Promise<any> {
    try {
      const { data } = await api1.upload(`${this.Projects}/${project_id}/${this.Surveys}/${surveyId}/definition-file`, formData, handleUploadProgress)
      return data
    } catch (error) {
      throw error
    }
  }
  // integration not done
  async postProjectDataFile(project_id: number, surveyId: number, formData: any, handleUploadProgress: any): Promise<any> {
    try {
      const { data } = await api1.upload(`${this.Projects}/${project_id}/${this.Surveys}/${surveyId}/data-file`, formData, handleUploadProgress)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_ota_questions(projectId: string | undefined): Promise<any> {
    try {
      const data = await api1.get(`${this.Projects}/${projectId}/ota`)

      return data
    } catch (error) {
      throw error
    }
  }

  async sort_project_builder_sub_question(
    obj:
      | {
        question_id: number
        parent_id: number
        child_sort_order: number
      }[]
      | [],
    projectId: string,
    surveyId: number,
    sectionId: string,
  ): Promise<Array<ActivityLogs>> {
    try {
      const data = await api1.patch(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/sections/${sectionId}/update/order/question/child`,
        obj,
      )

      return data
    } catch (error) {
      throw error
    }
  }

  async UploadConceptsFiles(project_id: number, surveyId: number, formData: any): Promise<any> {
    try {
      const data = await api1.upload(`${this.Projects}/${project_id}/${this.Surveys}/${surveyId}/concept`, formData, (_progressEvent: any) => { })
      return data
    } catch (error) {
      throw error
    }
  }

  async get_UploadConceptsFiles(project_id: number, surveyId: number,): Promise<FilesTypes[]> {
    try {
      const { data } = await api1.get(`${this.Projects}/${project_id}/${this.Surveys}/${surveyId}/concept`)
      return data
    } catch (error) {
      throw error
    }
  }

}

export { ProjectService }
