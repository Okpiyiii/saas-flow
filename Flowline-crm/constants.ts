import { Lead, PipelineStage } from './types';

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Elena Fisher',
    company: 'Linear',
    email: 'elena@linear.app',
    status: PipelineStage.QUALIFIED,
    value: 12000,
    owner: 'JD',
    source: 'Inbound',
    createdAt: '2023-10-01',
    avatar: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: '2',
    name: 'Nathan Drake',
    company: 'Uncharted Co.',
    email: 'nate@uncharted.com',
    status: PipelineStage.NEW,
    value: 5000,
    owner: 'JD',
    source: 'Web',
    createdAt: '2023-10-02',
    avatar: 'https://picsum.photos/100/100?random=2'
  },
  {
    id: '3',
    name: 'Lara Croft',
    company: 'Tomb Industries',
    email: 'lara@tomb.com',
    status: PipelineStage.PROPOSAL,
    value: 45000,
    owner: 'JD',
    source: 'Referral',
    createdAt: '2023-10-05',
    avatar: 'https://picsum.photos/100/100?random=3'
  },
  {
    id: '4',
    name: 'Arthur Morgan',
    company: 'Red Dead Inc.',
    email: 'arthur@rdr.com',
    status: PipelineStage.WON,
    value: 8500,
    owner: 'JD',
    source: 'Outbound',
    createdAt: '2023-09-15',
    avatar: 'https://picsum.photos/100/100?random=4'
  },
  {
    id: '5',
    name: 'Geralt of Rivia',
    company: 'Witcher Services',
    email: 'geralt@kaer.morhen',
    status: PipelineStage.CONTACTED,
    value: 2000,
    owner: 'JD',
    source: 'Web',
    createdAt: '2023-10-10',
    avatar: 'https://picsum.photos/100/100?random=5'
  },
  {
    id: '6',
    name: 'Joel Miller',
    company: 'Last of Us',
    email: 'joel@tlou.com',
    status: PipelineStage.LOST,
    value: 15000,
    owner: 'JD',
    source: 'Inbound',
    createdAt: '2023-09-01',
    avatar: 'https://picsum.photos/100/100?random=6'
  },
  {
    id: '7',
    name: 'Sam Porter',
    company: 'Bridges',
    email: 'sam@bridges.com',
    status: PipelineStage.NEW,
    value: 9200,
    owner: 'JD',
    source: 'Referral',
    createdAt: '2023-10-12',
    avatar: 'https://picsum.photos/100/100?random=7'
  }
];

export const PIPELINE_COLUMNS = [
  PipelineStage.NEW,
  PipelineStage.CONTACTED,
  PipelineStage.QUALIFIED,
  PipelineStage.PROPOSAL,
  PipelineStage.WON,
];
