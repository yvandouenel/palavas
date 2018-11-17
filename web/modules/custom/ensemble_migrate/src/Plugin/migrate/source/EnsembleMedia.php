<?php

namespace Drupal\ensemble_migrate\Plugin\migrate\source;

use Drupal\Core\Site\Settings;
use Drupal\Core\State\StateInterface;
use Drupal\migrate\Plugin\migrate\source\SqlBase;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\Row;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin de source pour les médias.
 *
 * @MigrateSource(
 *   id = "ensemble_dc_media"
 * )
 */
class EnsembleMedia extends SqlBase {

  /**
   * Retrieve site read-only settings.
   *
   * @var \Drupal\Core\Site\Settings
   */
  protected $settings;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration, StateInterface $state, Settings $settings) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $migration, $state);
    $this->settings = $settings;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration = NULL) {
    return new static($configuration, $plugin_id, $plugin_definition, $migration, $container->get('state'), $container->get('settings'));
  }

  /**
   * {@inheritdoc}
   */
  public function query() {
    $fields = [
      'media_id',
      'media_path',
      'media_title',
      'media_file',
      'media_dir',
      'media_meta',
      'media_dt',
      'media_creadt',
      'media_upddt',
    ];
    return $this->select('dc2_media', 'm')
      ->fields('m', $fields);
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'media_id' => $this->t('Media ID'),
      'media_path' => $this->t('Media path from Dotclear root'),
      'media_title' => $this->t('Media title'),
      'media_file' => $this->t('File name'),
      'media_dir' => $this->t('Media subdirectory'),
      'media_meta' => $this->t('Media metadata'),
      'media_dt' => $this->t('Actual media publication date'),
      'media_creadt' => $this->t('Alternate media publication date'),
      'media_upddt' => $this->t('Last time this media was updated'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'media_id' => [
        'type' => 'integer',
        'alias' => 'media_id',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    // Dates sous la forme de timestamps.
    // Note : il existe un plugin de process format_date, mais trop tard...
    $created = $row->getSourceProperty('media_dt');
    $updated = $row->getSourceProperty('media_upddt');
    $tz = $row->getSourceProperty('media_tz');
    $row->setSourceProperty('media_dt', strtotime($created . ' ' . $tz));
    $row->setSourceProperty('media_upddt', strtotime($updated . ' ' . $tz));

    // media_file inclut media_dir, ce qui ne nous intéresse pas dans le cadre
    // d'une migration.
    $media_file = $row->getSourceProperty('media_file');
    $row->setSourceProperty('media_file', basename($media_file));

    // Récupérer la racine de Dotclear.
    $row->setSourceProperty('dotclear_root', $this->settings->get('dotclear_root'));
  }

}
