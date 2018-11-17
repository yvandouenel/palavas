<?php

namespace Drupal\ensemble_migrate\Plugin\migrate\source;

use Drupal\migrate\Plugin\migrate\source\SqlBase;

/**
 * Plugin de source pour les thématiques.
 *
 * @MigrateSource(
 *   id = "ensemble_dc_thematique"
 * )
 */
class EnsembleThematique extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    return $this->select('dc2_category', 'c')
      ->fields('c', ['cat_id', 'cat_title', 'cat_url', 'cat_desc']);
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'cat_id' => $this->t('Category ID'),
      'cat_title' => $this->t('Category title'),
      'cat_desc' => $this->t('Category description'),
      'cat_url' => $this->t('Category path'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'cat_id' => [
        'type' => 'integer',
        'alias' => 'cat_id',
      ],
    ];
  }

}
