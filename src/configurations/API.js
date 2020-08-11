import { getDomainRef } from '../utilities'

const NAMESPACE = 'ns'

export const API = {
  GET_DOMAIN_DATA: (domain) => `/${NAMESPACE}/${domain}`,
  GET_DOMAIN_INSTANCE_DATA: (domain, id) => `/${NAMESPACE}/${domain}/${id}`,
  PUT_DOMAIN_INSTANCE_DATA: (domain, id) => `/${NAMESPACE}/${domain}/${id}`,
  GET_DOMAIN_INSTANCE_NAME: (link) => `/${NAMESPACE}${link}/name`,
  GET_HEALTH: '/health/ready',
  GET_SCHEMAS: `/${NAMESPACE}?schema=embed`,
  GRAPHQL: '/graphql'
}

export const GSIM = {
  ABOUT: {
    NAME: 'About',
    VERSION: ['definitions', 'About', 'properties', 'model_version', 'default'],
    CHANGELOG: ['definitions', 'About', 'properties', 'model_version', 'description']
  },
  DEFAULT_TABLE_HEADERS: ['id', 'name', 'description'],
  DESCRIPTION: (schema) => ['definitions', getDomainRef(schema), 'description'],
  DISPLAY_NAME: (schema) => ['definitions', getDomainRef(schema), 'displayName'],
  FORMAT: 'format',
  GROUPS: {
    BASE: {
      COLOR: '#d1b279',
      DOMAINS: [
        'AdministrativeDetails',
        'Agent',
        'AgentInRole',
        'ChangeEvent',
        'ChangeEventTuple',
        'Contact',
        'IdentifiableArtefact',
        'Individual',
        'Maintainer',
        'Organization',
        'Owner',
        'Role'
      ]
    },
    BUSINESS: {
      COLOR: '#679ad3',
      DOMAINS: [
        'Assessment',
        'BusinessCase',
        'BusinessFunction',
        'BusinessProcess',
        'BusinessService',
        'ChangeDefinition',
        'EnvironmentChange',
        'InformationRequest',
        'ParameterInput',
        'ProcessControl',
        'ProcessControlDesign',
        'ProcessDesign',
        'ProcessExecutionLog',
        'ProcessInput',
        'ProcessInputSpecification',
        'ProcessMethod',
        'ProcessMetric',
        'ProcessOutput',
        'ProcessOutputSpecification',
        'ProcessPattern',
        'ProcessStep',
        'ProcessStepInstance',
        'ProcessSupportInput',
        'Rule',
        'StatisticalNeed',
        'StatisticalProgram',
        'StatisticalProgramCycle',
        'StatisticalProgramDesign',
        'StatisticalSupportProgram',
        'TransformableInput',
        'TransformedOutput'
      ]
    },
    CONCEPT: {
      COLOR: '#95df95',
      DOMAINS: [
        'Category',
        'CategoryItem',
        'CategorySet',
        'ClassificationFamily',
        'ClassificationIndex',
        'ClassificationIndexEntry',
        'ClassificationItem',
        'ClassificationSeries',
        'Code',
        'CodeItem',
        'CodeList',
        'Concept',
        'ConceptSystem',
        'ConceptualDomain',
        'CorrespondenceTable',
        'Datum',
        'DescribedConceptualDomain',
        'DescribedValueDomain',
        'Designation',
        'EnumeratedConceptualDomain',
        'EnumeratedValueDomain',
        'InstanceVariable',
        'Level',
        'Map',
        'MeasurementType',
        'MeasurementUnit',
        'Node',
        'NodeSet',
        'Population',
        'RepresentedVariable',
        'SentinelValueDomain',
        'StatisticalClassification',
        'SubjectField',
        'SubstantiveValueDomain',
        'Unit',
        'UnitType',
        'Universe',
        'ValueDomain',
        'Variable'
      ]
    },
    EXCHANGE: {
      COLOR: '#ff7f7f',
      DOMAINS: [
        'AdministrativeRegister',
        'DataHarvest',
        'ExchangeChannel',
        'InformationConsumer',
        'InformationProvider',
        'InstanceQuestion',
        'InstanceQuestionBlock',
        'InstanceStatement',
        'OutputSpecification',
        'Presentation',
        'Product',
        'Protocol',
        'ProvisionAgreement',
        'Question',
        'QuestionBlock',
        'Questionnaire',
        'QuestionnaireComponent',
        'QuestionnaireLogic',
        'QuestionnaireSpecification',
        'Statement',
        'StatisticalRegister'
      ]
    },
    STRUCTURE: {
      COLOR: '#ead870',
      DOMAINS: [
        'AttributeComponent',
        'DataPoint',
        'DataResource',
        'DataSet',
        'DataStructure',
        'DataStructureComponent',
        'DimensionalDataPoint',
        'DimensionalDataSet',
        'DimensionalDataStructure',
        'IdentifierComponent',
        'InformationResource',
        'InformationSet',
        'LogicalRecord',
        'MeasureComponent',
        'RecordRelationship',
        'ReferentialMetadataAttribute',
        'ReferentialMetadataContentItem',
        'ReferentialMetadataResource',
        'ReferentialMetadataSet',
        'ReferentialMetadataStructure',
        'ReferentialMetadataSubject',
        'ReferentialMetadataSubjectItem',
        'UnitDataPoint',
        'UnitDataRecord',
        'UnitDataSet',
        'UnitDataStructure'
      ]
    }
  },
  ITEMS: 'items',
  LINK_TYPE: '_link_property_',
  LOCALIZED: {
    CODE: 'languageCode',
    TEXT: 'languageText'
  },
  PROPERTIES: (schema) => ['definitions', getDomainRef(schema), 'properties'],
  PROPERTIES_DISPLAY_NAME: (domain, property) => ['definitions', domain, 'properties', property, 'displayName'],
  PROPERTIES_GROUPING: {
    AUTOFILLED: ['id', 'createdDate', 'createdBy', 'version', 'versionValidFrom', 'lastUpdatedDate', 'lastUpdatedBy', 'validFrom', 'validUntil'],
    COMMON: ['name', 'description', 'shortName', 'administrativeStatus', 'versionRationale', 'administrativeDetails', 'agentInRoles']
  },
  PROPERTY_DESCRIPTION: 'description',
  PROPERTY_DISPLAY_NAME: 'displayName',
  SCHEMA: {
    DEFINITIONS: '#/definitions/',
    REF: '$ref'
  },
  TYPE: 'type'
}

export const GSIM_DEFINITIONS = {
  ADMINISTRATIVE_DETAILS: {
    NAME: 'AdministrativeDetails',
    PROPERTIES: {
      ADMINISTRATIVE_DETAIL_TYPE: 'administrativeDetailType',
      VALUES: 'values'
    },
    REFERENCE: `${GSIM.SCHEMA.DEFINITIONS}AdministrativeDetails`
  },
  AGENT_DETAILS: {
    NAME: 'AgentDetails',
    PROPERTIES: {
      AGENT_DETAIL_TYPE: 'agentDetailType',
      VALUES: 'values'
    },
    REFERENCE: `${GSIM.SCHEMA.DEFINITIONS}AgentDetails`
  },
  MULTILINGUAL_TEXT: {
    NAME: 'MultilingualText',
    PROPERTIES: {
      LANGUAGE_CODE: 'languageCode',
      LANGUAGE_TEXT: 'languageText'
    },
    REFERENCE: `${GSIM.SCHEMA.DEFINITIONS}MultilingualText`,
    LANGUAGE_TEXT: (value, language) => {
      const text = value.find(object => object['languageCode'] === language)

      if (text === undefined) {
        return value[0]['languageText']
      } else {
        return text['languageText']
      }
    }
  },
  PATH: ['items', GSIM.SCHEMA.REF]
}
