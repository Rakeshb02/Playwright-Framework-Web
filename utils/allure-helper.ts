import * as allure from 'allure-js-commons';

export type SeverityLevel = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';

export interface AllureMetadata {
  epic?: string;
  feature?: string;
  story?: string;
  suite?: string;
  subSuite?: string;
  parentSuite?: string;
  severity?: SeverityLevel;
  tags?: string[];
  description?: string;
  [key: string]: any;
}

const severityMap: Record<SeverityLevel, allure.Severity> = {
  blocker: allure.Severity.BLOCKER,
  critical: allure.Severity.CRITICAL,
  normal: allure.Severity.NORMAL,
  minor: allure.Severity.MINOR,
  trivial: allure.Severity.TRIVIAL,
};

/**
 * Declarative helper to attach Allure BDD metadata, tags, and severity to the current test.
 * Common hierarchy properties (parentSuite, suite, subSuite) are automatically populated
 * by the autoAllure fixture, but can be overridden here if explicitly passed.
 */
export async function allureDetails(metadata: AllureMetadata): Promise<void> {
  if (metadata.parentSuite) {
    await allure.parentSuite(metadata.parentSuite);
  }
  if (metadata.suite) {
    await allure.suite(metadata.suite);
  }
  if (metadata.subSuite) {
    await allure.subSuite(metadata.subSuite);
  }
  if (metadata.epic) {
    await allure.epic(metadata.epic);
  }
  if (metadata.feature) {
    await allure.feature(metadata.feature);
  }
  if (metadata.story) {
    await allure.story(metadata.story);
  }
  if (metadata.severity) {
    await allure.severity(severityMap[metadata.severity]);
  }
  if (metadata.description) {
    await allure.description(metadata.description);
  }
  if (metadata.tags && metadata.tags.length > 0) {
    await allure.tags(...metadata.tags);
  }
}
