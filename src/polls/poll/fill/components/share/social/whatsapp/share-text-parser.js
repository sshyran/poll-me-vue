import { pollTypes } from '@/polls/store/state/types';

function getOptionPercent(answers, value) {
  const optionVotes = answers.filter(ans => ans.option === value).length;
  return (optionVotes * 100) / answers.length;
}

function getPercentBar(percent) {
  const fillNumber = Math.round(percent / 10);
  const fillChar = '=';
  return `[${fillChar.repeat(fillNumber * 2)}${'  '.repeat((10 - fillNumber) * 2)}]`;
}

function getOptionText(answers, option) {
  const percent = getOptionPercent(answers, option.value);
  return `- *${option.label}* _(${percent}%)_\n${getPercentBar(percent)}`;
}

export default function () {
  const answers = this.poll.answers;
  const votesLength = answers.legnth;
  let shareText = '';

  switch (this.poll.type) {
    case pollTypes.YESNO: {
      const options = [
        { label: this.$t(`polls.types.${this.poll.type}.yes`), value: 1 },
        { label: this.$t(`polls.types.${this.poll.type}.no`), value: 0 }
      ];

      shareText = options.reduce(
        (text, option, i) => `${text}${i === 0 ? '\n' : ''}${getOptionText(answers, option)}\n`,
        ''
      );
      break;
    }

    default: {
      const answersList = answers.slice(0, this.answersLimit).reduce(
        (text, ans, i) => `${text}${i === 0 ? '\n' : ''}- ${ans.author}\n`,
        ''
      );
      const restAnswersLength = votesLength - this.answersLimit;
      const restAnswers = restAnswersLength > 0 ?
        `\n${this.$t('poll.fill.share.rest-people', { number: restAnswersLength })}\n` :
        '';
      shareText = `${answersList}${restAnswers}`;
    }
  }

  return shareText;
}
