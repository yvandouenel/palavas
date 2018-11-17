<?php

namespace Drupal\coopernetentityref\Controller;

use Drupal\Core\Url;
// Change following https://www.drupal.org/node/2457593
// See https://www.drupal.org/node/2549395 for deprecate methods information
// use Drupal\Component\Utility\SafeMarkup;
use Drupal\Component\Utility\Html;
// use Html instead SAfeMarkup

/**
 * Controller routines for Lorem ipsum pages.
 */
class coopernetentityrefController {

  /**
   * Constructs Lorem ipsum text with arguments.
   * This callback is mapped to the path
   * 'coopernetentityref/generate/'.
   *
   * @param string $paragraphs
   *   The amount of paragraphs that need to be generated.
   * @param string $phrases
   *   The maximum amount of phrases that can be generated inside a paragraph.
   */
  public function generate() {
    $element['#source_text'] = array();
    $element['#source_text'][] = Html::escape("Hello world");
    $element['#title'] = Html::escape("Link entities");
    $element['#theme'] = 'coopernetentityref';
      //dpm("Hello World");
    return $element;
  }
}
